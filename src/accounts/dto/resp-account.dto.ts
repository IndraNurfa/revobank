import { Expose, Transform, Type } from 'class-transformer';

export class BaseAccountResponseDto {
  @Expose()
  @Transform(
    ({ obj }: { obj: { account_number?: string } }) => obj.account_number ?? '',
    { toClassOnly: true },
  )
  full_name!: string | null;

  user_id: number;

  @Expose()
  @Transform(
    ({ obj }: { obj: { account_name?: string } }) => obj.account_name ?? '',
    { toClassOnly: true },
  )
  account_number: string;

  created_at: Date;

  updated_at: Date;
}

export class ResponseAccountDto extends BaseAccountResponseDto {
  @Expose()
  @Type(() => String)
  account_name: string;

  @Expose()
  @Type(() => String)
  account_type: string;

  @Expose()
  @Type(() => String)
  balance: string;
}
