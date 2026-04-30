import { Module } from '@nestjs/common';
import { VoicebanksService } from './voicebanks.service';
import { VoicebanksController } from './voicebanks.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VoicebanksController],
  providers: [VoicebanksService],
})
export class VoicebanksModule {}
