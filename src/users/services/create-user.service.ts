import { hash } from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

import { CreateUserDTO } from '../dtos/create-user.dto';

@Injectable()
export class CreateUserService {
  constructor(private prisma: PrismaService) {}

  async execute(userData: CreateUserDTO) {
    const { name, email, password } = userData;

    const checkUserExists = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (checkUserExists) {
      throw new HttpException(
        'User with same e-mail already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password.length < 3) {
      throw new HttpException('Password to small', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password, 12),
      },
    });

    return user;
  }
}
