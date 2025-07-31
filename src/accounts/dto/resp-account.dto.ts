import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class BaseAccountResponseDto {
  @ApiProperty({
    example: 'John Doe',
    description:
      'Full name of the account owner (transformed from account_number)',
  })
  @Expose()
  @Transform(
    ({ obj }: { obj: { account_number?: string } }) => obj.account_number ?? '',
    { toClassOnly: true },
  )
  full_name!: string | null;

  @ApiProperty({
    example: '1234567890',
    description: 'Account number of the user',
  })
  @Expose()
  @Transform(
    ({ obj }: { obj: { account_name?: string } }) => obj.account_name ?? '',
    { toClassOnly: true },
  )
  account_number: string;

  @ApiProperty({
    example: '0001-01-01T00:00:00.000Z',
    description: 'Date the account was created',
  })
  created_at: Date;

  @ApiProperty({
    example: '0001-01-01T00:00:00.000Z',
    description: 'Date the account was last updated',
  })
  updated_at: Date;
}

export class ResponseAccountDto extends BaseAccountResponseDto {
  @ApiProperty({
    example: 'monthly savings',
    description: 'Name of the account',
  })
  @Expose()
  @Type(() => String)
  account_name: string;

  @ApiProperty({
    example: 'SAVINGS',
    description: 'Type of the account (e.g., SAVINGS, CURRENT)',
  })
  @Expose()
  @Type(() => String)
  account_type: string;

  @ApiProperty({
    example: '0',
    description: 'Current balance in the account',
  })
  @Expose()
  @Type(() => String)
  balance: string;
}
