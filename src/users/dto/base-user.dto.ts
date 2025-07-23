import { IsDateString, IsEmail, IsString } from 'class-validator';

export class BaseUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  phone_number: string;

  @IsString()
  full_name: string;

  @IsString()
  address: string;

  @IsDateString()
  dob: Date;
}
