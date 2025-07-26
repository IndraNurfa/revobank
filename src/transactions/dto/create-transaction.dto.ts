import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseTransactionDto } from './base-transaction.dto';

export class TransferTransactionDto extends BaseTransactionDto {
  @ApiProperty({
    example: '1234567890',
    description: 'The account number of the receiver.',
  })
  @IsString()
  @IsNotEmpty()
  receiver_account: string;

  @ApiProperty({
    example: '0987654321',
    description: 'The account number of the sender.',
  })
  @IsString()
  @IsNotEmpty()
  sender_account: string;
}

export class WithdrawTransactionDto extends BaseTransactionDto {
  @ApiProperty({
    example: '0987654321',
    description: 'The account number of the sender (the one withdrawing).',
  })
  @IsString()
  @IsNotEmpty()
  sender_account: string;
}

export class DepositTransactionDto extends BaseTransactionDto {
  @ApiProperty({
    example: '1234567890',
    description: 'The account number of the receiver (the one depositing).',
  })
  @IsString()
  @IsNotEmpty()
  receiver_account: string;
}
