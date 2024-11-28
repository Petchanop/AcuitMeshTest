import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { dataSourceMockFactory, mockUserRepository } from './users.service.spec';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
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

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
