import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { TokenPayload } from 'src/auth/types/auth';
import { SerializationInterceptor } from 'src/core/interceptors/serialization.interceptor';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import {
  ResponseAccountDto,
  BaseAccountResponseDto,
} from './dto/resp-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accounts')
export class AccountsController {
  private logger = new Logger(AccountsController.name);

  constructor(private readonly accountsService: AccountsService) {}

  @UseInterceptors(new SerializationInterceptor(BaseAccountResponseDto))
  @Get(':id')
  findByAccountNumber(@Param('id') id: string) {
    try {
      return this.accountsService.findByAccountNumber(id);
    } catch (error) {
      this.logger.error('gets account failed', error);
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    try {
      const { sub } = user;
      return this.accountsService.update(id, sub, updateAccountDto);
    } catch (error) {
      this.logger.error('gets account failed', error);
    }
  }

  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.accountsService.remove(id);
    } catch (error) {
      this.logger.error('delete accounts failed', error);
    }
  }

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
      this.logger.error('update accounts failed', error);
    }
  }

  @UseInterceptors(new SerializationInterceptor(ResponseAccountDto))
  @Get()
  findAll(@CurrentUser() user: TokenPayload) {
    try {
      const { role } = user;
      if (role === 'admin') {
        return this.accountsService.findAll();
      }
      return this.accountsService.findByUserId(user.sub);
    } catch (error) {
      this.logger.error('get all acounts failed', error);
    }
  }
}
