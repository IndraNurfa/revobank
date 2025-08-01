import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { JwtHelpers } from '../common/utils/jwt-helpers';
import { ISessionService } from '../session/session.interface';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/req-auth.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtHelpers: Partial<Record<keyof JwtHelpers, jest.Mock>>;
  let sessionService: Partial<Record<keyof ISessionService, jest.Mock>>;

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findByUsername: jest.fn(),
    };
    jwtHelpers = {
      generate: jest.fn(),
    };
    sessionService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtHelpers, useValue: jwtHelpers },
        { provide: 'ISessionService', useValue: sessionService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should hash password, convert dob and call userService.create', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'test@example.com',
        phone_number: '08123456789',
        full_name: 'Test User',
        address: 'Jakarta',
        dob: new Date('1999-08-15'), // <-- Fix here
        role_id: 1,
        password: 'plainPassword',
      };

      const hashedPassword = 'hashedPassword123';

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(hashedPassword));

      usersService.create = jest.fn(); // Ensure create exists
      usersService.create.mockResolvedValue({
        id: 10,
        username: 'testuser',
        email: 'test@example.com',
        phone_number: '08123456789',
        full_name: 'Test User',
        address: 'Jakarta',
        dob: new Date('1999-08-15'),
        role_id: 1,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await authService.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
      expect(usersService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
        dob: new Date('1999-08-15'),
      });
    });
  });

  describe('login', () => {
    const mockLoginDto = {
      username: 'testuser',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      username: 'testuser',
      password: 'hashedPassword',
      full_name: 'Test User',
      role: {
        name: 'user',
      },
    };

    const mockAccessToken = 'mock.access.token';
    const mockRefreshToken = 'mock.refresh.token';

    beforeEach(() => {
      jest.clearAllMocks();
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hashedToken'));
    });

    it('should successfully login and return tokens', async () => {
      // Mock findByUsername
      usersService.findByUsername!.mockResolvedValue(mockUser);

      // Mock JWT token generation
      jwtHelpers
        .generate!.mockResolvedValueOnce(mockAccessToken)
        .mockResolvedValueOnce(mockRefreshToken);

      // Mock session creation
      sessionService.create!.mockResolvedValue({ id: 1 });

      const result = await authService.login(mockLoginDto);

      expect(usersService.findByUsername).toHaveBeenCalledWith(
        mockLoginDto.username,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginDto.password,
        mockUser.password,
      );
      expect(jwtHelpers.generate).toHaveBeenCalledTimes(2);
      expect(sessionService.create).toHaveBeenCalled();
      expect(result).toEqual({
        ...mockUser,
        access_token: mockAccessToken,
        refresh_token: mockRefreshToken,
      });
    });

    it('should throw BadRequestException when user is not found', async () => {
      usersService.findByUsername!.mockResolvedValue(null);

      await expect(authService.login(mockLoginDto)).rejects.toThrow(
        'username not found',
      );
    });

    it('should throw BadRequestException when password is invalid', async () => {
      usersService.findByUsername!.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(authService.login(mockLoginDto)).rejects.toThrow(
        'username or password is invalid.',
      );
    });
  });
});
