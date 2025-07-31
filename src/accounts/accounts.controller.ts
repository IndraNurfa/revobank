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
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Account } from '@prisma/client';
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

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accounts')
export class AccountsController {
  private logger = new Logger(AccountsController.name);

  constructor(private readonly accountsService: AccountsService) {}

  @UseInterceptors(new SerializationInterceptor(ResponseAccountDto))
  @Get(':id')
  @ApiOperation({ summary: 'Find account by account number' })
  @ApiParam({ name: 'id', description: 'Account number' })
  @ApiOkResponse({
    description: 'Account details found',
    type: ResponseAccountDto,
  })
  findByAccountNumber(@Param('id') id: string): Promise<Account> | undefined {
    try {
      return this.accountsService.findByAccountNumber(id);
    } catch (error) {
      this.logger.error('gets account failed', error);
    }
  }

  @UseInterceptors(new SerializationInterceptor(ResponseAccountDto))
  @Patch(':id')
  @ApiOperation({ summary: 'Update an account by ID' })
  @ApiParam({ name: 'id', description: 'Account ID to update' })
  @ApiBody({ type: UpdateAccountDto })
  @ApiOkResponse({
    description: 'Account updated successfully',
    type: ResponseAccountDto,
  })
  update(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> | undefined {
    try {
      const { sub } = user;
      return this.accountsService.update(id, sub, updateAccountDto);
    } catch (error) {
      this.logger.error('gets account failed', error);
    }
  }

  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account by ID (admin only)' })
  @ApiParam({ name: 'id', description: 'Account ID to delete' })
  @ApiNoContentResponse({ description: 'Successful delete account' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.accountsService.remove(id);
    } catch (error) {
      this.logger.error('delete accounts failed', error);
    }
  }

  @UseInterceptors(new SerializationInterceptor(ResponseAccountDto))
  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({ type: CreateAccountDto })
  @ApiOkResponse({
    description: 'Account created successfully',
    type: ResponseAccountDto,
  })
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
  @ApiOperation({ summary: 'Get all accounts (admin) or user’s own accounts' })
  @ApiOkResponse({
    description: 'List of accounts returned',
    type: [ResponseAccountDto],
  })
  findAll(@CurrentUser() user: TokenPayload): Promise<Account[]> | undefined {
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
