import { execSync } from 'child_process';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { UsersModule } from '../src/users/users.module';
import { ArtistsModule } from '../src/artists/artists.module';
import { VoicebanksModule } from '../src/voicebanks/voicebanks.module';

/**
 * Starts a real PostgreSQL container via Testcontainers, runs all migrations,
 * and returns a fully wired NestJS testing module.
 */

export interface TestContext {
  module: TestingModule;
  prisma: PrismaService;
  container: StartedPostgreSqlContainer;
}

export async function setupTestDb(): Promise<TestContext> {
  // Use postgres 15 to match the docker-compose version
  const container = await new PostgreSqlContainer('postgres:15-alpine')
    .withDatabase('testdb')
    .withUsername('test')
    .withPassword('test')
    .start();

  const url = container.getConnectionUri();

  // Set DATABASE_URL before the NestJS module boots so PrismaService picks it up
  process.env.DATABASE_URL = url;

  // Run all migrations against the fresh container
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: url },
    stdio: 'pipe',
  });

  const module = await Test.createTestingModule({
    imports: [PrismaModule, UsersModule, ArtistsModule, VoicebanksModule],
  }).compile();

  const prisma = module.get<PrismaService>(PrismaService);

  return { module, prisma, container };
}

export async function teardownTestDb(ctx: TestContext): Promise<void> {
  await ctx.module.close();
  await ctx.container.stop();
}

/**
 * Truncates all domain tables between tests to guarantee isolation.
 * Order matters — respect FK constraints.
 */
export async function cleanDatabase(prisma: PrismaService): Promise<void> {
  await prisma.$transaction([
    prisma.artist.deleteMany(),
    prisma.voiceBank.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}
