import { Test, TestingModule } from '@nestjs/testing';
import { VoicebanksService } from './voicebanks.service';

describe('VoicebanksService', () => {
  let service: VoicebanksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoicebanksService],
    }).compile();

    service = module.get<VoicebanksService>(VoicebanksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
