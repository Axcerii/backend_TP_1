import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PaginationDto } from '../users/dto/pagination.dto';

@Injectable()
export class ArtistsService {
    constructor(private readonly prisma: PrismaService) { }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    private async findOrFail(id: number) {
        const artist = await this.prisma.artist.findUnique({
            where: { id },
            include: { associatedArtists: true, associatedBy: true, voiceBanks: true },
        });
        if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
        return artist;
    }

    // ── CRUD ─────────────────────────────────────────────────────────────────────

    create(dto: CreateArtistDto) {
        const { associatedArtistIds, voiceBankIds, ...data } = dto;
        return this.prisma.artist.create({
            data: {
                ...data,
                associatedArtists: associatedArtistIds?.length
                    ? { connect: associatedArtistIds.map((id) => ({ id })) }
                    : undefined,
                voiceBanks: voiceBankIds?.length
                    ? { connect: voiceBankIds.map((id) => ({ id })) }
                    : undefined,
            },
            include: { associatedArtists: true, voiceBanks: true },
        });
    }

    async findAll(pagination: PaginationDto) {
        const limit = pagination.limit ?? 10;
        const include = { associatedArtists: true, voiceBanks: true };

        if (pagination.mode !== 'cursor') {
            const page = pagination.page ?? 1;
            const skip = (page - 1) * limit;
            const [data, total] = await Promise.all([
                this.prisma.artist.findMany({ skip, take: limit, orderBy: { id: 'asc' }, include }),
                this.prisma.artist.count(),
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

        const data = await this.prisma.artist.findMany({
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

    async update(id: number, dto: UpdateArtistDto) {
        await this.findOrFail(id);
        const { associatedArtistIds, voiceBankIds, ...data } = dto;
        return this.prisma.artist.update({
            where: { id },
            data: {
                ...data,
                associatedArtists: associatedArtistIds
                    ? { set: associatedArtistIds.map((aid) => ({ id: aid })) }
                    : undefined,
                voiceBanks: voiceBankIds
                    ? { set: voiceBankIds.map((vid) => ({ id: vid })) }
                    : undefined,
            },
            include: { associatedArtists: true, voiceBanks: true },
        });
    }

    async remove(id: number) {
        await this.findOrFail(id);
        return this.prisma.artist.delete({ where: { id } });
    }
}
