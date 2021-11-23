import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { jwtSettings } from './constants';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: jwtSettings.secret,
      signOptions: { expiresIn: '120s' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
