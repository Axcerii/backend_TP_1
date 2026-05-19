import { UsersService } from '../../../src/users/users.service';
import { setupTestDb, teardownTestDb, cleanDatabase, TestContext } from '../../setupFakeDb';
import { NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../../../src/users/dto/pagination.dto';

describe('UsersService (Integration)', () => {
  let ctx: TestContext;
  let service: UsersService;

  beforeAll(async () => {
    ctx = await setupTestDb();
    service = ctx.module.get<UsersService>(UsersService);
  }, 60000);

  afterAll(async () => {
    await teardownTestDb(ctx);
  });

  beforeEach(async () => {
    await cleanDatabase(ctx.prisma);
  });

  describe('create', () => {
    it('should create a user in the real database', async () => {
      const result = await service.create({
        email: 'test@example.com',
        name: 'John Doe',
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('John Doe');

      // Verify it's actually in the database
      const dbUser = await ctx.prisma.user.findUnique({ where: { id: result.id } });
      expect(dbUser).toBeDefined();
      expect(dbUser?.email).toBe('test@example.com');
    });
  });

  describe('findOne', () => {
    it('should return a user if it exists and compute fullName', async () => {
      const seeded = await ctx.prisma.user.create({
        data: { email: 'jane@example.com', name: 'Jane Smith' },
      });

      const result = await service.findOne(seeded.id);
      expect(result).toBeDefined();
      expect(result.id).toBe(seeded.id);
      expect(result.email).toBe('jane@example.com');
      expect(result.fullName).toBe('Jane Smith');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated users (offset)', async () => {
      await ctx.prisma.user.createMany({
        data: [
          { email: 'u1@example.com', name: 'User 1' },
          { email: 'u2@example.com', name: 'User 2' },
          { email: 'u3@example.com', name: 'User 3' },
        ],
      });

      const pagination: PaginationDto = { limit: 2, page: 1, mode: 'offset' };
      const result = await service.findAll(pagination);

      expect(result.mode).toBe('offset');
      expect(result.data.length).toBe(2);
      expect(result.meta.total).toBe(3);
      expect(result.meta.totalPages).toBe(2);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const seeded = await ctx.prisma.user.create({
        data: { email: 'old@example.com', name: 'Old Name' },
      });

      const result = await service.update(seeded.id, { name: 'New Name' } as any);
      expect(result.name).toBe('New Name');

      const dbUser = await ctx.prisma.user.findUnique({ where: { id: seeded.id } });
      expect(dbUser?.name).toBe('New Name');
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      await expect(service.update('non-existent-id', { name: 'test' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user from the database', async () => {
      const seeded = await ctx.prisma.user.create({
        data: { email: 'delete@example.com', name: 'To Delete' },
      });

      await service.remove(seeded.id);

      const dbUser = await ctx.prisma.user.findUnique({ where: { id: seeded.id } });
      expect(dbUser).toBeNull();
    });
  });
});
