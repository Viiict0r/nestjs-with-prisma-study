/* eslint-disable @typescript-eslint/no-unused-vars */
import { compare } from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './interfaces/Payload';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validate(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    if (await compare(password, user.password)) {
      const { password, ...result } = user;

      return this.login(result);
    }

    return null;
  }

  async login(user: any) {
    const payload: Payload = {
      name: user.name,
      email: user.email,
      id: user.id,
    };

    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
