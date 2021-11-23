import { Test } from '@nestjs/testing';

import { CreateTodoService } from './create-todo.service';
import { PrismaService } from '../../database/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { DeepMockProxy } from 'jest-mock-extended/lib/Mock';
import { BadRequestException } from '@nestjs/common';

type PrismaMockProxy = DeepMockProxy<PrismaService>;

describe('CreateTodoService', () => {
  let service: CreateTodoService;
  let mockedPrisma: PrismaMockProxy;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateTodoService,
        {
          provide: PrismaService,
          useFactory: () => mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = moduleRef.get<CreateTodoService>(CreateTodoService);
    mockedPrisma = moduleRef.get(PrismaService) as PrismaMockProxy;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockedPrisma).toBeDefined();
  });

  it('should be able to create a todo item', async () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@gmail.com',
      password: '123123',
    };

    const todo = {
      id: 1,
      user_id: 1,
      title: 'Teste Todo',
      description: 'Descrição do todo',
    };

    // Mock prisma results
    mockedPrisma.user.findUnique.mockResolvedValue(user);
    mockedPrisma.todo.create.mockResolvedValue(todo);

    const createdTodo = await service.execute({
      title: todo.title,
      description: todo.description,
      user_id: user.id,
    });

    expect(createdTodo).toBe(todo);
  });

  it('should not be able to create a todo item with invalid user', async () => {
    // Mock prisma results
    mockedPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.execute({
        title: 'Title todo',
        description: 'Lorem ipsum',
        user_id: 1,
      }),
    ).rejects.toThrowError(BadRequestException);
  });
});
