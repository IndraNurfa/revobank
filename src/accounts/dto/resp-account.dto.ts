import { Expose, Transform, Type } from 'class-transformer';

export class ResponseAccountDto {
  @Expose()
  @Transform(
    ({ obj }: { obj: { user?: { full_name?: string } } }) =>
      obj.user?.full_name ?? null,
  )
  full_name!: string | null;

  user_id: number;

  @Expose()
  @Type(() => String)
  account_number: string;

  @Expose()
  @Type(() => String)
  account_name: string;

  @Expose()
  @Type(() => String)
  account_type: string;

  @Expose()
  @Type(() => String)
  balance: string;

  created_at: Date;

  updated_at: Date;
}
