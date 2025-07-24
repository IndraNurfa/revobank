import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/types/auth';
import { SerializationInterceptor } from 'src/core/interceptors/serialization.interceptor';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ResponseGetUsersDto } from './dto/resp-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  private logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(new SerializationInterceptor(ResponseGetUsersDto))
  @Get('profile')
  findOne(@CurrentUser() user: TokenPayload) {
    try {
      const { username } = user;
      return this.usersService.findByUsername(username);
    } catch (error) {
      this.logger.error('get profile failed', error);
    }
  }

  // PATCH /user/profile: Update user profile
  @Patch('profile')
  updateOne(@CurrentUser() user: TokenPayload, @Body() dto: UpdateUserDto) {
    try {
      const { sub } = user;
      return this.usersService.update(sub, dto);
    } catch (error) {
      this.logger.error('update profile failed', error);
    }
  }
}
