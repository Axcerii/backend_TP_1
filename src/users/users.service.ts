import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: { email: createUserDto.email, firstName: createUserDto.firstName, lastName: createUserDto.lastName } });
  }

  async findAll(pagination: PaginationDto) {
    const limit = pagination.limit ?? 1;

    // ── Offset / classic pagination ──────────────────────────────────────────────
    if (pagination.mode !== 'cursor') {
      const page = pagination.page ?? 1;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.user.findMany({ skip, take: limit, orderBy: { id: 'asc' } }),
        this.prisma.user.count(),
      ]);

      return {
        mode: 'offset',
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasPreviousPage: page > 1,
          hasNextPage: page < Math.ceil(total / limit),
        },
      };
    }

    // ── Cursor-based pagination ───────────────────────────────────────────────────
    const data = await this.prisma.user.findMany({
      take: limit + 1, // fetch one extra to know if a next page exists
      ...(pagination.cursor && { cursor: { id: pagination.cursor }, skip: 1 }),
      orderBy: { id: 'asc' },
    });

    const hasNextPage = data.length > limit;
    const items = hasNextPage ? data.slice(0, limit) : data;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return {
      mode: 'cursor',
      data: items,
      meta: {
        limit,
        nextCursor,   // pass this as ?cursor=X on your next request
        hasNextPage,
      },
    };
  }


  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return {
      ...user,
      fullName: [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || null,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.prisma.user.update({ where: { id }, data: { firstName: updateUserDto.firstName, lastName: updateUserDto.lastName } });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
