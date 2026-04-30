import { VoicebanksService } from '../../../src/voicebanks/voicebanks.service';
import { setupTestDb, teardownTestDb, cleanDatabase, TestContext } from '../../setupFakeDb';
import { NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../../../src/users/dto/pagination.dto';

describe('VoicebanksService (Integration)', () => {
  let ctx: TestContext;
  let service: VoicebanksService;

  beforeAll(async () => {
    ctx = await setupTestDb();
    service = ctx.module.get<VoicebanksService>(VoicebanksService);
  }, 60000); // Increase timeout because pulling the postgres image and starting it takes time

  afterAll(async () => {
    await teardownTestDb(ctx);
  });

  beforeEach(async () => {
    await cleanDatabase(ctx.prisma);
  });

  describe('create', () => {
    it('should create a voicebank in the real database', async () => {
      const result = await service.create({
        name: 'Hatsune Miku V4X',
        language: ['Japanese', 'English'],
        software: ['Vocaloid4'],
      });

      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
      expect(result.name).toBe('Hatsune Miku V4X');
      expect(result.language).toEqual(['Japanese', 'English']);

      // Verify it's actually in the database
      const dbVoicebank = await ctx.prisma.voiceBank.findUnique({ where: { id: result.id } });
      expect(dbVoicebank).toBeDefined();
      expect(dbVoicebank?.name).toBe('Hatsune Miku V4X');
    });
  });

  describe('findOne', () => {
    it('should return a voicebank if it exists', async () => {
      // Seed data directly
      const seeded = await ctx.prisma.voiceBank.create({
        data: { name: 'Kagamine Rin V4X', language: ['Japanese'], software: ['Vocaloid4'] },
      });

      const result = await service.findOne(seeded.id);
      expect(result).toBeDefined();
      expect(result.id).toBe(seeded.id);
      expect(result.name).toBe('Kagamine Rin V4X');
    });

    it('should throw NotFoundException if voicebank does not exist', async () => {
      await expect(service.findOne(99999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated voicebanks', async () => {
      // Seed multiple voicebanks
      await ctx.prisma.voiceBank.createMany({
        data: [
          { name: 'Miku V4X', language: ['Japanese'], software: ['Vocaloid4'] },
          { name: 'Rin V4X', language: ['Japanese'], software: ['Vocaloid4'] },
          { name: 'Len V4X', language: ['Japanese'], software: ['Vocaloid4'] },
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
    it('should update an existing voicebank', async () => {
      const seeded = await ctx.prisma.voiceBank.create({
        data: { name: 'Old Name', language: ['Japanese'], software: ['Vocaloid4'] },
      });

      const result = await service.update(seeded.id, { name: 'New Name' });
      expect(result.name).toBe('New Name');

      const dbVoicebank = await ctx.prisma.voiceBank.findUnique({ where: { id: seeded.id } });
      expect(dbVoicebank?.name).toBe('New Name');
    });

    it('should throw NotFoundException when updating non-existent voicebank', async () => {
      await expect(service.update(99999, { name: 'test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a voicebank from the database', async () => {
      const seeded = await ctx.prisma.voiceBank.create({
        data: { name: 'To Delete', language: ['Japanese'], software: ['Vocaloid4'] },
      });

      await service.remove(seeded.id);

      const dbVoicebank = await ctx.prisma.voiceBank.findUnique({ where: { id: seeded.id } });
      expect(dbVoicebank).toBeNull();
    });

    it('should throw NotFoundException when deleting non-existent voicebank', async () => {
      await expect(service.remove(99999)).rejects.toThrow(NotFoundException);
    });
  });
});
