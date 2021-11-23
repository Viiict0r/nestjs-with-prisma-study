import { hash } from 'bcryptjs';
import { Test } from '@nestjs/testing';
import { CreateUserService } from './create-user.service';

import { PrismaService } from '../../database/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { DeepMockProxy } from 'jest-mock-extended/lib/Mock';
import { HttpException } from '@nestjs/common';

type PrismaMockProxy = DeepMockProxy<PrismaService>;

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
  let mockedPrisma: PrismaMockProxy;
  let testPassword: string;

  beforeAll(async () => {
    testPassword = await hash('123123', 12);
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: PrismaService,
          useFactory: () => mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    createUserService = moduleRef.get<CreateUserService>(CreateUserService);
    mockedPrisma = moduleRef.get(PrismaService) as PrismaMockProxy;
  });

  it('should be defined', () => {
    expect(createUserService).toBeDefined();
    expect(mockedPrisma).toBeDefined();
  });

  it('should be able to create a user', async () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@gmail.com',
      password: testPassword,
    };

    // Mock prisma results
    mockedPrisma.user.findUnique.mockResolvedValue(null);
    mockedPrisma.user.create.mockResolvedValue(user);

    const createdUser = await createUserService.execute({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: user.password,
    });

    expect(createdUser).toBe(user);
  });

  it('should not be able to create user with exist e-mail', async () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@gmail.com',
      password: testPassword,
    };

    // Mock prisma results
    mockedPrisma.user.findUnique.mockResolvedValue(user);

    const userData = {
      name: 'John Doe',
      email: 'john@gmail.com',
      password: '123123',
    };

    await expect(createUserService.execute(userData)).rejects.toThrowError(
      HttpException,
    );
  });
});
