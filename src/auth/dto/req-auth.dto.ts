import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'johndoe', maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  username: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '081234567890', maxLength: 15 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  phone_number: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'Jl. Merdeka No. 123' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '1995-06-15', type: String, format: 'date' })
  @IsDateString()
  @IsNotEmpty()
  dob: Date;

  @ApiProperty({
    example: 2,
    description: 'Role ID, e.g., 1 for admin, 2 for user',
  })
  @IsNumber()
  @IsNotEmpty()
  role_id: number;

  @ApiProperty({ example: 'strongPassword123', minLength: 6, maxLength: 46 })
  @IsString()
  @IsNotEmpty()
  @Length(6, 46)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'strongPassword123', minLength: 6, maxLength: 46 })
  @IsString()
  @IsNotEmpty()
  @Length(6, 46)
  password: string;
}
