import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/types/auth';
import { SerializationInterceptor } from 'src/core/interceptors/serialization.interceptor';
import {
  DepositTransactionDto,
  TransferTransactionDto,
  WithdrawTransactionDto,
} from './dto/create-transaction.dto';
import {
  BaseTransactionResponseDto,
  DetailTransactionResponseDto,
} from './dto/resp-transaction.dto';
import { TransactionsService } from './transactions.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  private logger = new Logger(TransactionsController.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  @UseInterceptors(new SerializationInterceptor(BaseTransactionResponseDto))
  @Post('deposit')
  @ApiOperation({ summary: 'Create a deposit transaction' })
  @ApiBody({ type: DepositTransactionDto })
  @ApiOkResponse({
    description: 'Deposit transaction created successfully',
    type: BaseTransactionResponseDto,
  })
  deposit(
    @CurrentUser() user: TokenPayload,
    @Body() dto: DepositTransactionDto,
  ) {
    try {
      const { sub } = user;

      return this.transactionsService.deposit(sub, dto);
    } catch (error) {
      this.logger.error('deposit failed', error);
    }
  }

  @UseInterceptors(new SerializationInterceptor(BaseTransactionResponseDto))
  @Post('withdraw')
  @ApiOperation({ summary: 'Create a withdrawal transaction' })
  @ApiBody({ type: WithdrawTransactionDto })
  @ApiOkResponse({
    description: 'Withdrawal transaction created successfully',
    type: BaseTransactionResponseDto,
  })
  withdraw(
    @CurrentUser() user: TokenPayload,
    @Body() dto: WithdrawTransactionDto,
  ) {
    try {
      const { sub } = user;
      return this.transactionsService.withdraw(sub, dto);
    } catch (error) {
      this.logger.error('withdraw failed', error);
    }
  }

  @UseInterceptors(new SerializationInterceptor(BaseTransactionResponseDto))
  @Post('transfer')
  @ApiOperation({ summary: 'Create a transfer transaction' })
  @ApiBody({ type: TransferTransactionDto })
  @ApiOkResponse({
    description: 'Transfer transaction created successfully',
    type: BaseTransactionResponseDto,
  })
  transfer(
    @CurrentUser() user: TokenPayload,
    @Body() dto: TransferTransactionDto,
  ) {
    try {
      const { sub } = user;
      return this.transactionsService.transfer(sub, dto);
    } catch (error) {
      this.logger.error('transfer failed', error);
    }
  }

  @UseInterceptors(new SerializationInterceptor(DetailTransactionResponseDto))
  @Get(':id')
  @ApiOperation({ summary: 'Get transaction details by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    description: 'Transaction detail returned successfully',
    type: DetailTransactionResponseDto,
  })
  findOne(@CurrentUser() user: TokenPayload, @Param('id') id: string) {
    try {
      return this.transactionsService.findOne(id);
    } catch (error) {
      this.logger.error('get transaction by id failed', error);
    }
  }

  @UseInterceptors(new SerializationInterceptor(BaseTransactionResponseDto))
  @Get()
  @ApiOperation({ summary: "Get all transactions (admin) or user's own" })
  @ApiOkResponse({
    description: 'List of transactions returned successfully',
    type: [BaseTransactionResponseDto],
  })
  findAll(@CurrentUser() user: TokenPayload) {
    try {
      const { sub, role } = user;
      if (role === 'admin') {
        return this.transactionsService.findAll();
      }
      return this.transactionsService.findAllByUserId(sub);
    } catch (error) {
      this.logger.error('get transaction failed', error);
    }
  }
}
