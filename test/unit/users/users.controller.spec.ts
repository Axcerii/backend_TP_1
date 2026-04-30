import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../../src/users/users.controller';
import { UsersService } from '../../../src/users/users.service';
import { CreateUserDto } from '../../../src/users/dto/create-user.dto';
import { UpdateUserDto } from '../../../src/users/dto/update-user.dto';
import { PaginationDto } from '../../../src/users/dto/pagination.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue({ data: [mockUser], meta: { total: 1 } }),
    findOne: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    remove: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createDto: CreateUserDto = { email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
      expect(await controller.create(createDto)).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const pagination: PaginationDto = { limit: 10, page: 1, mode: 'offset' };
      expect(await controller.findAll(pagination)).toEqual({ data: [mockUser], meta: { total: 1 } });
      expect(service.findAll).toHaveBeenCalledWith(pagination);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      expect(await controller.findOne('1')).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto: UpdateUserDto = { firstName: 'Johnny' };
      expect(await controller.update('1', updateDto)).toEqual(mockUser);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      expect(await controller.remove('1')).toEqual(mockUser);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
