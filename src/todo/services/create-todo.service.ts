import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/database/prisma.service';

import { CreateTodoDTO } from '../dtos/create-todo.dto';

@Injectable()
export class CreateTodoService {
  constructor(private prisma: PrismaService) {}

  async execute(todo: CreateTodoDTO) {
    const { description, user_id, title } = todo;

    const checkUserExists = await this.prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!checkUserExists) {
      throw new BadRequestException('todo.create.error.user_does_not_exists');
    }

    const created = await this.prisma.todo.create({
      data: {
        description: description,
        title,
        user_id,
      },
    });

    return created;
  }
}
