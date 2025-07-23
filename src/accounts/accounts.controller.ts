import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { TokenPayload } from 'src/auth/types/auth';
import { SerializationInterceptor } from 'src/core/interceptors/serialization.interceptor';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ResponseAccountDto } from './dto/resp-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accounts')
export class AccountsController {
  private logger = new Logger(AccountsController.name);
  constructor(private readonly accountsService: AccountsService) {}

  @UseInterceptors(new SerializationInterceptor(ResponseAccountDto))
  @Post()
  async create(
    @CurrentUser() user: TokenPayload,
    @Body() dto: CreateAccountDto,
  ) {
    try {
      const { sub } = user;
      return await this.accountsService.create(sub, dto);
    } catch (error) {
      this.logger.error('create account failed', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `An account already exists for this user.`,
          );
        }
        this.logger.error('Unhandled Prisma error', error.code, error.meta);
      }
      throw new InternalServerErrorException('something wrong on our side');
    }
  }

  @UseInterceptors(new SerializationInterceptor(ResponseAccountDto))
  @Get(':id')
  findByAccountNumber(@Param('id') id: string) {
    return this.accountsService.findByAccountNumber(id);
  }

  @UseInterceptors(new SerializationInterceptor(ResponseAccountDto))
  @Get()
  findAll(@CurrentUser() user: TokenPayload) {
    return this.accountsService.findByUserId(user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.accountsService.remove(id);
  }
}
