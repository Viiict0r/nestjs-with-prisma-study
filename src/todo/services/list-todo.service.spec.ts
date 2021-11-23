import { Test } from '@nestjs/testing';

import { PrismaService } from '../../database/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { DeepMockProxy } from 'jest-mock-extended/lib/Mock';
import { ListTodoService } from './list-todo.service';
import { BadRequestException } from '@nestjs/common';

type PrismaMockProxy = DeepMockProxy<PrismaService>;

describe('ListTodoService', () => {
  let service: ListTodoService;
  let mockedPrisma: PrismaMockProxy;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListTodoService,
        {
          provide: PrismaService,
          useFactory: () => mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = moduleRef.get<ListTodoService>(ListTodoService);
    mockedPrisma = moduleRef.get(PrismaService) as PrismaMockProxy;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockedPrisma).toBeDefined();
  });

  it('should be able to list user todo itens', async () => {
    const result = [
      {
        id: 1,
        title: 'Todo title',
        description: 'Todo description',
        user_id: 1,
      },
      {
        id: 2,
        title: 'Todo title',
        description: 'Todo description',
        user_id: 1,
      },
    ];

    const user = {
      id: 1,
      name: 'Victor',
      email: 'victor@gmail.com',
      password: '123123',
    };

    mockedPrisma.user.findUnique.mockResolvedValue(user);
    mockedPrisma.todo.findMany.mockResolvedValue(result);

    const spy = jest.spyOn(mockedPrisma.todo, 'findMany');

    expect(await service.execute({ user_id: 1 })).toBe(result);
    expect(spy).toHaveBeenCalledWith({ where: { user_id: 1 } });
  });

  it('should not be able to list todo itens with invalid user id', async () => {
    const invalid_user_id = 99;

    mockedPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.execute({ user_id: invalid_user_id }),
    ).rejects.toThrowError(BadRequestException);
  });
});
