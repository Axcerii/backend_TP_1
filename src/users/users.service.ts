import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: { email: createUserDto.email, name: createUserDto.name } });
  }

  async findAll(pagination: PaginationDto) {
    const limit = pagination.limit ?? 1;
    const where = pagination.role ? { role: pagination.role } : {};

    // ── Offset / classic pagination ──────────────────────────────────────────────
    if (pagination.mode !== 'cursor') {
      const page = pagination.page ?? 1;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.user.findMany({ where, skip, take: limit, orderBy: { id: 'asc' } }),
        this.prisma.user.count({ where }),
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
      where,
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


  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return {
      ...user,
      fullName: user.name,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    // Need to cast the DTO since UpdateUserDto still uses firstName/lastName or is updated
    return this.prisma.user.update({ where: { id }, data: { name: (updateUserDto as any).name } });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
