/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SerializationInterceptor } from 'src/core/interceptors/serialization.interceptor';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/req-auth.dto';
import { ResponseLoginDto, ResponseRegisterDto } from './dto/resp-auth.dto';
import { Roles } from 'src/core/decorator/roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @UseInterceptors(new SerializationInterceptor(ResponseRegisterDto))
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ResponseRegisterDto> {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      this.logger.error('Registration failed', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const field = (error.meta?.target as string[])[0];

          throw new ConflictException(
            `A user already exists with this ${field}.`,
          );
        }

        this.logger.error('Unhandled Prisma error', error.code, error.meta);
      }
      throw new InternalServerErrorException('something wrong on our side');
    }
  }

  @UseInterceptors(new SerializationInterceptor(ResponseLoginDto))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      this.logger.error('Login failed', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('username or password is invalid.');
        }
      }
      throw new InternalServerErrorException('something wrong on our side');
    }
  }

  // example get role guards
  @Roles('USER')
  @Get()
  check() {
    return 'good job!';
  }
}
