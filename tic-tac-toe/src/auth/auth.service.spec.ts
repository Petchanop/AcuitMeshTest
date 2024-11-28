import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

const mockAuthService = {
  register: jest.fn(),
  signIn: jest.fn()
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: AuthService,
        useValue: mockAuthService
      },],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
