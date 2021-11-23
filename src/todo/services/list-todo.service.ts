import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/database/prisma.service';
import { CreateTodoDTO } from '../dtos/create-todo.dto';

@Injectable()
export class ListTodoService {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ user_id }: Pick<CreateTodoDTO, 'user_id'>) {
    const checkUserExists = await this.prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!checkUserExists) {
      throw new BadRequestException('todo.list.error.user_not_found');
    }

    const todoList = await this.prisma.todo.findMany({
      where: {
        user_id,
      },
    });

    return todoList;
  }
}
