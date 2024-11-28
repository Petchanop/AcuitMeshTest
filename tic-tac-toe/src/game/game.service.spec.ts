import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';

export const mockGameService = {
  checkHorizontal: jest.fn(),
  checkVertical: jest.fn(),
  checkDiagonal: jest.fn(),
  availablePosition: jest.fn(),
  checkWinner: jest.fn(),
};

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: GameService,
          useValue: mockGameService,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
