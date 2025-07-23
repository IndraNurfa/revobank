import { Expose, Transform, Type } from 'class-transformer';

export class ResponseRegisterDto {
  @Expose()
  @Type(() => Number)
  id: number;

  @Expose()
  @Type(() => String)
  username: string;

  @Expose()
  @Type(() => String)
  email: string;

  @Expose()
  @Type(() => String)
  phone_number: string;

  @Expose()
  @Type(() => String)
  full_name: string;

  @Expose()
  @Type(() => String)
  address: string;

  @Expose()
  @Transform(({ value }) => {
    // Ensure it's a Date object before formatting
    const date = new Date(value as string);
    return date.toISOString().split('T')[0]; // returns "YYYY-MM-DD"
  })
  dob: Date;

  @Expose()
  @Type(() => Number)
  role_id: number;

  @Expose()
  @Type(() => Date)
  created_at: Date;

  @Expose()
  @Type(() => Date)
  updated_at: Date;
}

export class ResponseLoginDto {
  @Expose()
  @Type(() => Number)
  id: number;

  @Expose()
  @Type(() => String)
  username: string;

  @Expose()
  @Type(() => String)
  full_name: string;

  @Expose()
  @Type(() => String)
  email: string;

  @Expose()
  @Type(() => String)
  access_token: string;

  @Expose()
  @Type(() => String)
  refresh_token: string;
}

export class ResponseRefreshTokenDto {
  @Expose()
  @Type(() => String)
  access_token: string;
}
