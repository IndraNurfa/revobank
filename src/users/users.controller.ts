import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/types/auth';
import { SerializationInterceptor } from 'src/core/interceptors/serialization.interceptor';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ResponseGetUsersDto } from './dto/resp-user.dto';
import { UpdateUserPartialDto } from './dto/update-user-partial.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUsersService } from './users.interface';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  private logger = new Logger(UsersController.name);

  constructor(
    @Inject('IUsersService') private readonly usersService: IUsersService,
  ) {}

  @Get('profile')
  @UseInterceptors(new SerializationInterceptor(ResponseGetUsersDto))
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({
    description: 'User profile fetched successfully',
    type: ResponseGetUsersDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findOne(@CurrentUser() user: TokenPayload): Promise<User | undefined> {
    try {
      const { username } = user;
      return await this.usersService.findByUsername(username);
    } catch (error) {
      this.logger.error('get profile failed', error);
    }
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({
    type: UpdateUserPartialDto,
    description: 'Fields to update user profile (all optional)',
  })
  @ApiOkResponse({
    description: 'User profile updated successfully',
    type: ResponseGetUsersDto,
  })
  async updateOne(
    @CurrentUser() user: TokenPayload,
    @Body() dto: UpdateUserDto,
  ) {
    try {
      const { sub } = user;
      return await this.usersService.update(sub, dto);
    } catch (error) {
      this.logger.error('update profile failed', error);
    }
  }
}
