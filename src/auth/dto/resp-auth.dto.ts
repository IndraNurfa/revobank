import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class ResponseRegisterDto {
  @ApiProperty({ example: 1 })
  @Expose()
  @Type(() => Number)
  id: number;

  @ApiProperty({ example: 'johndoe' })
  @Expose()
  @Type(() => String)
  username: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @Expose()
  @Type(() => String)
  email: string;

  @ApiProperty({ example: '081234567890' })
  @Expose()
  @Type(() => String)
  phone_number: string;

  @ApiProperty({ example: 'John Doe' })
  @Expose()
  @Type(() => String)
  full_name: string;

  @ApiProperty({ example: 'Jl. Merdeka No. 123' })
  @Expose()
  @Type(() => String)
  address: string;

  @ApiProperty({ example: '1995-06-15', type: String, format: 'date' })
  @Expose()
  @Transform(({ value }) => {
    const date = new Date(value);
    return date.toISOString().split('T')[0];
  })
  dob: Date;

  @ApiProperty({ example: 2 })
  @Expose()
  @Type(() => Number)
  role_id: number;

  @ApiProperty({
    example: '0001-01-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  created_at: Date;

  @ApiProperty({
    example: '0001-01-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  updated_at: Date;
}

export class ResponseLoginDto {
  @ApiProperty({ example: 1 })
  @Expose()
  @Type(() => Number)
  id: number;

  @ApiProperty({ example: 'johndoe@example.com' })
  @Expose()
  @Type(() => String)
  username: string;

  @ApiProperty({ example: 'John Doe' })
  @Expose()
  @Type(() => String)
  full_name: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @Expose()
  @Type(() => String)
  email: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  @Expose()
  @Type(() => String)
  access_token: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token',
  })
  @Expose()
  @Type(() => String)
  refresh_token: string;
}

export class ResponseRefreshTokenDto {
  @Expose()
  @Type(() => String)
  access_token: string;
}
