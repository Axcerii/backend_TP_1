import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVoicebankDto } from './dto/create-voicebank.dto';
import { UpdateVoicebankDto } from './dto/update-voicebank.dto';
import { PaginationDto } from '../users/dto/pagination.dto';

@Injectable()
export class VoicebanksService {
    constructor(private readonly prisma: PrismaService) { }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    private async findOrFail(id: number) {
        const vb = await this.prisma.voiceBank.findUnique({
            where: { id },
            include: { artists: true },
        });
        if (!vb) throw new NotFoundException(`VoiceBank with id ${id} not found`);
        return vb;
    }

    // ── CRUD ─────────────────────────────────────────────────────────────────────

    create(dto: CreateVoicebankDto) {
        return this.prisma.voiceBank.create({
            data: { ...dto },
            include: { artists: true },
        });
    }

    async findAll(pagination: PaginationDto) {
        const limit = pagination.limit ?? 10;
        const include = { artists: true };

        if (pagination.mode !== 'cursor') {
            const page = pagination.page ?? 1;
            const skip = (page - 1) * limit;
            const [data, total] = await Promise.all([
                this.prisma.voiceBank.findMany({ skip, take: limit, orderBy: { id: 'asc' }, include }),
                this.prisma.voiceBank.count(),
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

        const data = await this.prisma.voiceBank.findMany({
            take: limit + 1,
            ...(pagination.cursor && { cursor: { id: parseInt(pagination.cursor, 10) }, skip: 1 }),
            orderBy: { id: 'asc' },
            include,
        });
        const hasNextPage = data.length > limit;
        const items = hasNextPage ? data.slice(0, limit) : data;
        return {
            mode: 'cursor',
            data: items,
            meta: { limit, nextCursor: hasNextPage ? items[items.length - 1].id : null, hasNextPage },
        };
    }

    findOne(id: number) {
        return this.findOrFail(id);
    }

    async update(id: number, dto: UpdateVoicebankDto) {
        await this.findOrFail(id);
        return this.prisma.voiceBank.update({
            where: { id },
            data: { ...dto },
            include: { artists: true },
        });
    }

    async remove(id: number) {
        await this.findOrFail(id);
        return this.prisma.voiceBank.delete({ where: { id } });
    }
}
