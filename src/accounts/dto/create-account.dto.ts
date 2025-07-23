import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  phone_number: string;

  @IsString()
  @IsOptional()
  full_name: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsDateString()
  @IsOptional()
  dob: Date;

  @IsString()
  @IsOptional()
  @Length(6, 46)
  password: string;
}
