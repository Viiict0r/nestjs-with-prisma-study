import { Module } from '@nestjs/common';
import { CreateTodoService } from './services/create-todo.service';
import { ListTodoService } from './services/list-todo.service';

import { TodosController } from './todo.controller';

@Module({
  controllers: [TodosController],
  providers: [CreateTodoService, ListTodoService],
})
export class TodoModule {}
