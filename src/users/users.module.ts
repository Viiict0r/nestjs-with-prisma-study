import { Module } from '@nestjs/common';
import { CreateUserService } from './services/create-user.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [CreateUserService],
})
export class UsersModule {}
