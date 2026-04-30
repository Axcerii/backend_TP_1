import { Test, TestingModule } from '@nestjs/testing';
import { VoicebanksController } from '../../../src/voicebanks/voicebanks.controller';
import { VoicebanksService } from '../../../src/voicebanks/voicebanks.service';
import { CreateVoicebankDto } from '../../../src/voicebanks/dto/create-voicebank.dto';
import { UpdateVoicebankDto } from '../../../src/voicebanks/dto/update-voicebank.dto';
import { PaginationDto } from '../../../src/users/dto/pagination.dto';

describe('VoicebanksController', () => {
  let controller: VoicebanksController;
  let service: VoicebanksService;

  const mockVoicebank = {
    id: 1,
    name: 'Hatsune Miku V4X',
    language: ['Japanese', 'English'],
    software: ['Vocaloid4'],
    createdAt: new Date(),
    updatedAt: new Date(),
    softDelete: false,
  };

  const mockVoicebanksService = {
    create: jest.fn().mockResolvedValue(mockVoicebank),
    findAll: jest.fn().mockResolvedValue({ data: [mockVoicebank], meta: { total: 1 } }),
    findOne: jest.fn().mockResolvedValue(mockVoicebank),
    update: jest.fn().mockResolvedValue(mockVoicebank),
    remove: jest.fn().mockResolvedValue(mockVoicebank),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoicebanksController],
      providers: [
        {
          provide: VoicebanksService,
          useValue: mockVoicebanksService,
        },
      ],
    }).compile();

    controller = module.get<VoicebanksController>(VoicebanksController);
    service = module.get<VoicebanksService>(VoicebanksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a voicebank', async () => {
      const createDto: CreateVoicebankDto = { name: 'Hatsune Miku V4X' };
      expect(await controller.create(createDto)).toEqual(mockVoicebank);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated voicebanks', async () => {
      const pagination: PaginationDto = { limit: 10, page: 1, mode: 'offset' };
      expect(await controller.findAll(pagination)).toEqual({ data: [mockVoicebank], meta: { total: 1 } });
      expect(service.findAll).toHaveBeenCalledWith(pagination);
    });
  });

  describe('findOne', () => {
    it('should return a single voicebank', async () => {
      expect(await controller.findOne('1')).toEqual(mockVoicebank);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a voicebank', async () => {
      const updateDto: UpdateVoicebankDto = { name: 'Miku V4X' };
      expect(await controller.update('1', updateDto)).toEqual(mockVoicebank);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a voicebank', async () => {
      expect(await controller.remove('1')).toEqual(mockVoicebank);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
