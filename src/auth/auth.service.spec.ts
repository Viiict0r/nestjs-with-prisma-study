import { hash } from 'bcryptjs';
import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';

import { PrismaService } from '@src/database/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { DeepMockProxy } from 'jest-mock-extended/lib/Mock';
import { JwtModule, JwtService } from '@nestjs/jwt';

type PrismaMockProxy = DeepMockProxy<PrismaService>;

describe('CreateUserService', () => {
  let service: AuthService;
  let mockedPrisma: PrismaMockProxy;
  let testPassword: string;

  beforeAll(async () => {
    testPassword = await hash('123123', 12);
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useFactory: () => mockDeep<PrismaService>(),
        },
      ],
    })
      .overrideProvider(JwtService)
      .useValue({
        sign: jest.fn(),
      })
      .compile();

    service = moduleRef.get<AuthService>(AuthService);
    mockedPrisma = moduleRef.get(PrismaService) as PrismaMockProxy;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockedPrisma).toBeDefined();
  });

  it('should be able to authenticate', async () => {
    const user = {
      id: 1,
      name: 'Test user',
      email: 'test@gmail.com',
      password: testPassword,
    };

    mockedPrisma.user.findUnique.mockResolvedValue(user);

    const loginSpy = jest.spyOn(service, 'login');

    await service.validate('test@gmail.com', '123123');

    expect(loginSpy).toHaveBeenCalledTimes(1);
  });

  it('should not be able to authenticate with invalid password', async () => {
    const user = {
      id: 1,
      name: 'Test user',
      email: 'test@gmail.com',
      password: testPassword,
    };

    mockedPrisma.user.findUnique.mockResolvedValue(user);

    expect(await service.validate('test@gmail.com', 'invalid_pass')).toBe(null);
  });

  it('should not be able to authenticate with inexistent user', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);

    expect(await service.validate('invalid@gmail.com', '123123')).toBe(null);
  });
});
