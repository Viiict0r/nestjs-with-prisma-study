import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '@src/pipes/joi-validation.pipe';
import { CreateUserDTO } from './dtos/create-user.dto';
import { CreateUserService } from './services/create-user.service';
import { CreateUserSchema } from './users.validation';

@Controller('users')
export class UsersController {
  constructor(private createUserService: CreateUserService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(CreateUserSchema))
  async create(@Body() userData: CreateUserDTO) {
    return this.createUserService.execute(userData);
  }
}
