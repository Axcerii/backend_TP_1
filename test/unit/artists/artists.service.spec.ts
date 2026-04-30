import { ArtistsService } from '../../../src/artists/artists.service';
import { setupTestDb, teardownTestDb, cleanDatabase, TestContext } from '../../setupFakeDb';
import { NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../../../src/users/dto/pagination.dto';

describe('ArtistsService (Integration)', () => {
  let ctx: TestContext;
  let service: ArtistsService;

  beforeAll(async () => {
    ctx = await setupTestDb();
    service = ctx.module.get<ArtistsService>(ArtistsService);
  }, 60000); // Increase timeout because pulling the postgres image and starting it takes time

  afterAll(async () => {
    await teardownTestDb(ctx);
  });

  beforeEach(async () => {
    await cleanDatabase(ctx.prisma);
  });

  describe('create', () => {
    it('should create an artist in the real database', async () => {
      const result = await service.create({
        nickname: 'Hatsune Miku',
        realName: 'Saki Fujita',
        jobs: ['Vocaloid'],
      });

      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
      expect(result.nickname).toBe('Hatsune Miku');
      expect(result.realName).toBe('Saki Fujita');
      expect(result.jobs).toEqual(['Vocaloid']);

      // Verify it's actually in the database
      const dbArtist = await ctx.prisma.artist.findUnique({ where: { id: result.id } });
      expect(dbArtist).toBeDefined();
      expect(dbArtist?.nickname).toBe('Hatsune Miku');
    });
  });

  describe('findOne', () => {
    it('should return an artist if it exists', async () => {
      // Seed data directly
      const seeded = await ctx.prisma.artist.create({
        data: { nickname: 'Kagamine Rin', jobs: ['Vocaloid'] },
      });

      const result = await service.findOne(seeded.id);
      expect(result).toBeDefined();
      expect(result.id).toBe(seeded.id);
      expect(result.nickname).toBe('Kagamine Rin');
    });

    it('should throw NotFoundException if artist does not exist', async () => {
      await expect(service.findOne(99999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated artists', async () => {
      // Seed multiple artists
      await ctx.prisma.artist.createMany({
        data: [
          { nickname: 'Miku', jobs: ['Vocaloid'] },
          { nickname: 'Rin', jobs: ['Vocaloid'] },
          { nickname: 'Len', jobs: ['Vocaloid'] },
        ],
      });

      const pagination: PaginationDto = { limit: 2, page: 1, mode: 'offset' };
      const result = await service.findAll(pagination);

      expect(result.mode).toBe('offset');
      expect(result.data.length).toBe(2);
      expect(result.meta.total).toBe(3);
      expect(result.meta.totalPages).toBe(2);
      expect(result.meta.hasNextPage).toBe(true);
    });
  });

  describe('update', () => {
    it('should update an existing artist', async () => {
      const seeded = await ctx.prisma.artist.create({
        data: { nickname: 'Old Name', jobs: ['Vocaloid'] },
      });

      const result = await service.update(seeded.id, { nickname: 'New Name' });
      expect(result.nickname).toBe('New Name');

      const dbArtist = await ctx.prisma.artist.findUnique({ where: { id: seeded.id } });
      expect(dbArtist?.nickname).toBe('New Name');
    });

    it('should throw NotFoundException when updating non-existent artist', async () => {
      await expect(service.update(99999, { nickname: 'test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an artist from the database', async () => {
      const seeded = await ctx.prisma.artist.create({
        data: { nickname: 'To Delete', jobs: ['Vocaloid'] },
      });

      await service.remove(seeded.id);

      const dbArtist = await ctx.prisma.artist.findUnique({ where: { id: seeded.id } });
      expect(dbArtist).toBeNull();
    });

    it('should throw NotFoundException when deleting non-existent artist', async () => {
      await expect(service.remove(99999)).rejects.toThrow(NotFoundException);
    });
  });
});
