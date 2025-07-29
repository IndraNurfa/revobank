import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsString, MaxLength } from 'class-validator';

export class BaseUserDto {
  @ApiProperty({ example: 'johndoe', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  username: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '081234567890', maxLength: 15 })
  @IsString()
  @MaxLength(15)
  phone_number: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  full_name: string;

  @ApiProperty({ example: 'Jl. Merdeka No. 123' })
  @IsString()
  address: string;

  @ApiProperty({ example: '1995-06-15', type: String, format: 'date' })
  @IsDateString()
  dob: Date;
}
