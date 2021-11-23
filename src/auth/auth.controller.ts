import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '@src/pipes/joi-validation.pipe';
import { AuthService } from './auth.service';
import { CreateSessionSchema } from './auth.validation';
import { CreateSessionDTO } from './dtos/create-session.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/session')
  @UsePipes(new JoiValidationPipe(CreateSessionSchema))
  async create(@Body() sessionData: CreateSessionDTO) {
    return this.authService.validate(sessionData.email, sessionData.password);
  }
}
