import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { JoiValidationPipe } from '@src/pipes/joi-validation.pipe';

import { CreateTodoDTO } from './dtos/create-todo.dto';
import { CreateTodoService } from './services/create-todo.service';
import { ListTodoService } from './services/list-todo.service';
import { CreateTodoSchema } from './todo.validation';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(
    private createTodoService: CreateTodoService,
    private listTodoService: ListTodoService,
  ) {}

  @Post()
  @UsePipes(new JoiValidationPipe(CreateTodoSchema))
  async create(@Request() req, @Body() data: CreateTodoDTO) {
    const todo = await this.createTodoService.execute({
      description: data.description,
      title: data.title,
      user_id: req.user.id,
    });

    return todo;
  }

  @Get()
  async list(@Request() req) {
    const result = await this.listTodoService.execute({ user_id: req.user.id });

    return result;
  }
}
