import { Test, TestingModule } from '@nestjs/testing';
import { VoicebanksController } from './voicebanks.controller';
import { VoicebanksService } from './voicebanks.service';

describe('VoicebanksController', () => {
  let controller: VoicebanksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoicebanksController],
      providers: [VoicebanksService],
    }).compile();

    controller = module.get<VoicebanksController>(VoicebanksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
