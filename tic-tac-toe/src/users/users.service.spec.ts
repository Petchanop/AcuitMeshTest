import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { CreateUserDto, PaginationUserDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';

export const mockUserRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  find: jest.fn(),
  getUserByUserName: jest.fn(),
};

export const dataSourceMockFactory = {
  getRepository: jest.fn().mockReturnValue(mockUserRepository),
}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        DataSource,
        Repository,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: DataSource,
          useValue: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => should create new user', async () => {
    const createUserDto = {
      username: 'Chadwick',
      email: 'chadwickboseman@email.com',
      password: 'abcdGG124%%',
    } as CreateUserDto;

    const user = {
      username: 'Chadwick',
      email: 'chadwickboseman@email.com',
      password: 'abcdGG124%%',
    } as User;

    jest.spyOn(dataSourceMockFactory, 'getRepository').getMockImplementation()

    // act
    const result = await service.create(createUserDto);

    // assert
    expect(mockUserRepository.save).toHaveBeenCalled();

    expect(user.username).toEqual(result.username);
    expect(user.email).toEqual(result.email);

    const IsPasswordMatch = await bcrypt.compare(user.password, result.password);
    expect(IsPasswordMatch).toEqual(true);
  })

  it('findAll => should return a list of user', async () => {
    const user = {
      username: 'Chadwick',
      email: 'chadwickboseman@email.com',
      password: 'abcdGG124%%',
      role: 'user'
    } as User;
    const users = [user] as User[];

    jest.spyOn(mockUserRepository, 'find').mockReturnValue(users);

    await service.create(user);

    const pagination = {
      page: 1,
      pageSize: 1,
    } as PaginationUserDto

    const result = await service.findAll(pagination);

    expect(mockUserRepository.find).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

});
