import { IsNotEmpty, IsString } from 'class-validator';
import { BaseTransactionDto } from './base-transaction.dto';

export class TransferTransactionDto extends BaseTransactionDto {
  @IsString()
  @IsNotEmpty()
  receiver_account: string;

  @IsString()
  @IsNotEmpty()
  sender_account: string;
}

export class WithdrawTransactionDto extends BaseTransactionDto {
  @IsString()
  @IsNotEmpty()
  sender_account: string;
}

export class DepositTransactionDto extends BaseTransactionDto {
  @IsString()
  @IsNotEmpty()
  receiver_account: string;
}
