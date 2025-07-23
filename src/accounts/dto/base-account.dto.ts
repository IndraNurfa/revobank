import { AccountType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BaseAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  account_name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(AccountType)
  account_type: string;
}
