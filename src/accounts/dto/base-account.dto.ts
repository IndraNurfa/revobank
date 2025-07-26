import { AccountType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class BaseAccountDto {
  @ApiProperty({
    example: 'Main Savings Account',
    description: 'The name of the account.',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  account_name: string;

  @ApiProperty({
    example: 'SAVINGS',
    enum: AccountType,
    description: 'The type of the account.',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(AccountType)
  account_type: string;
}
