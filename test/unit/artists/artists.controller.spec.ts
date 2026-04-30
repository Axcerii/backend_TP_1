import { Test, TestingModule } from '@nestjs/testing';
import { ArtistsController } from '../../../src/artists/artists.controller';
import { ArtistsService } from '../../../src/artists/artists.service';
import { CreateArtistDto } from '../../../src/artists/dto/create-artist.dto';
import { UpdateArtistDto } from '../../../src/artists/dto/update-artist.dto';
import { PaginationDto } from '../../../src/users/dto/pagination.dto';

describe('ArtistsController', () => {
  let controller: ArtistsController;
  let service: ArtistsService;

  const mockArtist = {
    id: 1,
    nickname: 'nqrse',
    realName: 'なるせ',
    jobs: ['Vocaloid'],
    createdAt: new Date(),
    updatedAt: new Date(),
    softDelete: false,
  };

  const mockArtistsService = {
    create: jest.fn().mockResolvedValue(mockArtist),
    findAll: jest.fn().mockResolvedValue({ data: [mockArtist], meta: { total: 1 } }),
    findOne: jest.fn().mockResolvedValue(mockArtist),
    update: jest.fn().mockResolvedValue(mockArtist),
    remove: jest.fn().mockResolvedValue(mockArtist),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers: [
        {
          provide: ArtistsService,
          useValue: mockArtistsService,
        },
      ],
    }).compile();

    controller = module.get<ArtistsController>(ArtistsController);
    service = module.get<ArtistsService>(ArtistsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an artist', async () => {
      const createDto: CreateArtistDto = { nickname: 'Hatsune Miku' };
      expect(await controller.create(createDto)).toEqual(mockArtist);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated artists', async () => {
      const pagination: PaginationDto = { limit: 10, page: 1, mode: 'offset' };
      expect(await controller.findAll(pagination)).toEqual({ data: [mockArtist], meta: { total: 1 } });
      expect(service.findAll).toHaveBeenCalledWith(pagination);
    });
  });

  describe('findOne', () => {
    it('should return a single artist', async () => {
      expect(await controller.findOne('1')).toEqual(mockArtist);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an artist', async () => {
      const updateDto: UpdateArtistDto = { nickname: 'Miku' };
      expect(await controller.update('1', updateDto)).toEqual(mockArtist);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove an artist', async () => {
      expect(await controller.remove('1')).toEqual(mockArtist);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
