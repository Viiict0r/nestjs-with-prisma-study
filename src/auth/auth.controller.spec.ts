import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '@src/database/prisma.service';

class AuthServiceMock extends AuthService {
  async validate(): Promise<any> {
    return {};
  }
}

describe('AuthController E2E', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [JwtModule],
      providers: [
        PrismaService,
        {
          provide: AuthService,
          useClass: AuthServiceMock,
        },
      ],
    })
      .overrideProvider(JwtService)
      .useValue({
        sign: jest.fn(),
      })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication();
    authService = moduleRef.get<AuthService>(AuthService);

    await app.init();
  });

  describe('POST - /auth/session', () => {
    it('should be able to create a new session', async () => {
      const result = {
        user: {
          id: 1,
          email: 'teste@gmail.com',
          name: 'John Doe',
        },
        access_token: 'jwt-access-token',
      } as any;

      jest.spyOn(authService, 'validate').mockImplementation(() => result);

      return request(app.getHttpServer())
        .post('/auth/session')
        .send({
          email: 'teste@gmail.com',
          password: '123456',
        })
        .expect(201)
        .expect(result);
    });

    it('should not be able to create a new session with invalid body data', async () => {
      return request(app.getHttpServer())
        .post('/auth/session')
        .send({})
        .expect(400);
    });

    it('should not be able to create a new session with invalid e-mail', async () => {
      return request(app.getHttpServer())
        .post('/auth/session')
        .send({
          email: 'invalid-mail',
          password: '123456',
        })
        .expect(400);
    });
  });
});
