import { Module } from '@nestjs/common';
import { VoicebanksService } from './voicebanks.service';
import { VoicebanksController } from './voicebanks.controller';

@Module({
  controllers: [VoicebanksController],
  providers: [VoicebanksService],
})
export class VoicebanksModule {}
