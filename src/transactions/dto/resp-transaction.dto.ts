import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsString } from 'class-validator';

export enum TransactionType {
  TOPUP = 'TOPUP',
  TRANSFER = 'TRANSFER',
  WITHDRAW = 'WITHDRAW',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
}

class TransactionAdditionalInfoDto {
  @ApiProperty({ example: 'Testing Transaction' })
  @Expose()
  note?: string;
}

export class BaseTransactionResponseDto {
  @ApiProperty({ example: '2025072923211744889923' })
  @Expose()
  @Type(() => String)
  reference_id: string;

  @ApiProperty({
    example: 15000,
  })
  @Expose()
  @Type(() => String)
  amount: string;

  @ApiProperty({
    example: TransactionType.TOPUP,
    enum: TransactionType,
    description: 'Type of the transaction',
  })
  @Expose()
  @Type(() => String)
  transaction_type: string;

  @ApiProperty({
    example: TransactionStatus.SUCCESS,
    enum: TransactionStatus,
    description: 'Transaction status',
  })
  @Expose()
  @Type(() => String)
  transaction_status: string;

  @ApiProperty({
    example: '0001-01-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Expose()
  @Type(() => String)
  created_at: Date;
}

export class DetailTransactionResponseDto extends BaseTransactionResponseDto {
  @ApiProperty({ example: 'Transfer to John Doe' })
  @Expose()
  @Type(() => String)
  description: string;

  @Expose()
  @Type(() => TransactionAdditionalInfoDto)
  additional_info: TransactionAdditionalInfoDto;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @Expose({ name: 'receiver_account' })
  @Transform(
    ({
      obj,
    }: {
      obj: {
        account_transactions?: Array<{
          account_transaction_type: string;
          account?: { account_number?: string };
        }>;
      };
    }) =>
      obj.account_transactions?.find(
        (at: {
          account_transaction_type: string;
          account?: { account_number?: string };
        }) => at.account_transaction_type === 'CREDIT',
      )?.account?.account_number ?? '',
    { toClassOnly: true },
  )
  receiver_account: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @Expose({ name: 'receiver_account_name' })
  @Transform(
    ({
      obj,
    }: {
      obj: {
        account_transactions?: Array<{
          account_transaction_type: string;
          account?: {
            account_name?: string;
          };
        }>;
      };
    }) =>
      obj.account_transactions?.find(
        (at: {
          account_transaction_type: string;
          account?: {
            account_name?: string;
          };
        }) => at.account_transaction_type === 'CREDIT',
      )?.account?.account_name ?? '',
    { toClassOnly: true },
  )
  receiver_account_name: string;

  @ApiProperty({ example: '1987654320' })
  @IsString()
  @Expose({ name: 'sender_account' })
  @Transform(
    ({
      obj,
    }: {
      obj: {
        account_transactions?: Array<{
          account_transaction_type: string;
          account?: {
            account_name?: string;
          };
        }>;
      };
    }) =>
      obj.account_transactions?.find(
        (at: {
          account_transaction_type: string;
          account?: {
            account_name?: string;
          };
        }) => at.account_transaction_type === 'DEBIT',
      )?.account?.account_name ?? '',
    { toClassOnly: true },
  )
  sender_account: string;

  @ApiProperty({ example: 'Michael Jordan' })
  @IsString()
  @Expose({ name: 'sender_account_name' })
  @Transform(
    ({
      obj,
    }: {
      obj: {
        account_transactions?: Array<{
          account_transaction_type: string;
          account?: { account_number?: string };
        }>;
      };
    }) =>
      obj.account_transactions?.find(
        (at: {
          account_transaction_type: string;
          account?: { account_number?: string };
        }) => at.account_transaction_type === 'DEBIT',
      )?.account?.account_number ?? '',
    { toClassOnly: true },
  )
  sender_account_name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value : ''), {
    toClassOnly: true,
  })
  account_type: string;
}
