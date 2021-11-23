import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@src/database/prisma.service';

import { CreateUserService } from './services/create-user.service';
import { UsersController } from './users.controller';

class CreateUserServiceMock extends CreateUserService {
  async execute(): Promise<any> {
    return {};
  }
}

describe('UsersController E2E', () => {
  let app: INestApplication;
  let createUserService: CreateUserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        PrismaService,
        {
          provide: CreateUserService,
          useClass: CreateUserServiceMock,
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication();
    createUserService = moduleRef.get<CreateUserService>(CreateUserService);

    await app.init();
  });

  describe('POST - /users', () => {
    it('should be able to create a new user', async () => {
      const result = {
        id: 1,
        email: 'teste@gmail.com',
        name: 'John Doe',
        password: '123456',
      } as any;

      jest.spyOn(createUserService, 'execute').mockImplementation(() => result);

      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'teste@gmail.com',
          name: 'John Doe',
          password: '123456',
        })
        .expect(201)
        .expect(result);
    });

    it('should not be able to create a user with invalid body data', async () => {
      return request(app.getHttpServer()).post('/users').send({}).expect(400);
    });

    it('should not be able to create a user with invalid e-mail', async () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'invalid-mail',
          name: 'John Doe',
          password: '123456',
        })
        .expect(400);
    });

    it('should not be able to create a user with name length < 3', async () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'teste@gmail.com',
          name: '',
          password: '123456',
        })
        .expect(400);
    });

    it('should not be able to create a user with name length > 20 caracters', async () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'teste@gmail.com',
          name: 'Name name name name name name name name name name name',
          password: '123456',
        })
        .expect(400);
    });

    it('should not be able to create a user with password smaller than 6 caracters', async () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'teste@gmail.com',
          name: 'John Doe',
          password: '123',
        })
        .expect(400);
    });
  });
});
