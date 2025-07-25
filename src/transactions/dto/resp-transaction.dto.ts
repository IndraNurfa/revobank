import { Expose, Transform, Type } from 'class-transformer';
import { IsString } from 'class-validator';

class TransactionAdditionalInfoDto {
  @Expose()
  note?: string;
}

export class BaseTransactionResponseDto {
  @Expose()
  @Type(() => String)
  reference_id: string;

  @Expose()
  @Type(() => String)
  amount: string;

  @Expose()
  @Type(() => String)
  transaction_type: string;

  @Expose()
  @Type(() => String)
  transaction_status: string;
}

export class DetailTransactionResponseDto extends BaseTransactionResponseDto {
  @Expose()
  @Type(() => String)
  description: string;

  @Expose()
  @Type(() => String)
  created_at: Date;

  @Expose()
  @Type(() => TransactionAdditionalInfoDto)
  additional_info: TransactionAdditionalInfoDto;

  @IsString()
  @Expose({ name: 'receiver_account' })
  @Transform(
    ({ obj }) =>
      obj.account_transactions?.find(
        (at: any) => at.account_transaction_type === 'CREDIT',
      )?.account?.account_number ?? '',
    { toClassOnly: true },
  )
  receiver_account: string;

  @IsString()
  @Expose({ name: 'receiver_account_name' })
  @Transform(
    ({ obj }) =>
      obj.account_transactions?.find(
        (at: any) => at.account_transaction_type === 'CREDIT',
      )?.account?.account_name ?? '',
    { toClassOnly: true },
  )
  receiver_account_name: string;

  @IsString()
  @Expose({ name: 'sender_account' })
  @Transform(
    ({ obj }) =>
      obj.account_transactions?.find(
        (at: any) => at.account_transaction_type === 'DEBIT',
      )?.account?.account_number ?? '',
    { toClassOnly: true },
  )
  sender_account: string;

  @IsString()
  @Expose({ name: 'sender_account_name' })
  @Transform(
    ({ obj }) =>
      obj.account_transactions?.find(
        (at: any) => at.account_transaction_type === 'DEBIT',
      )?.account?.account_name ?? '',
    { toClassOnly: true },
  )
  sender_account_name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value : ''), {
    toClassOnly: true,
  })
  account_type: string;
}
