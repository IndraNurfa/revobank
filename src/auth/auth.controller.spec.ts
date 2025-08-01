import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { AuthController } from './auth.controller';
import { LoginDto } from './dto/req-auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: { register: jest.Mock; login: jest.Mock };

  beforeEach(async () => {
    authService = { register: jest.fn(), login: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: 'IAuthService', useValue: authService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    const registerDto = {
      username: 'johndoe',
      email: 'johndoe@example.com',
      phone_number: '081234567890',
      full_name: 'John Doe',
      address: 'Jl. Merdeka No. 123',
      dob: new Date('1995-06-15'),
      role_id: 2,
      password: 'strongPassword123',
    };

    const returnedUser = {
      id: 1,
      username: 'johndoe',
      email: 'johndoe@example.com',
      phone_number: '081234567890',
      full_name: 'John Doe',
      address: 'Jl. Merdeka No. 123',
      dob: new Date('1995-06-15'),
      role_id: 2,
      created_at: new Date('0001-01-01T00:00:00.000Z'),
      updated_at: new Date('0001-01-01T00:00:00.000Z'),
    };

    it('should return registered user data on success', async () => {
      authService.register.mockResolvedValue(returnedUser);

      const result = await authController.register(registerDto);

      expect(result).toEqual(returnedUser);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw ConflictException on Prisma unique constraint error', async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (`email`)',
        {
          code: 'P2002',
          clientVersion: '6.12.0',
          meta: { target: ['email'] },
        },
      );

      jest.spyOn(authService, 'register').mockRejectedValue(error);

      await expect(authController.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException on unknown errors', async () => {
      authService.register.mockRejectedValue(new Error('Unknown error'));

      await expect(authController.register(registerDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('login', () => {
    const mockLoginDto: LoginDto = {
      username: 'johndoe',
      password: 'strongPassword123',
    };

    const mockLoginResponse = {
      id: 7,
      username: 'johndoe',
      full_name: 'John Doe',
      email: 'johndoe@example.com',
      access_token: 'fakeAccessToken',
      refresh_token: 'fakeRefreshToken',
    };

    it('should return login response on success', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResponse);

      const result = await authController.login(mockLoginDto);

      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should throw NotFoundException with "username not found"', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new NotFoundException('username not found'));

      await expect(authController.login(mockLoginDto)).rejects.toThrow(
        NotFoundException,
      );

      await expect(authController.login(mockLoginDto)).rejects.toThrow(
        'username not found',
      );
    });
  });
});
