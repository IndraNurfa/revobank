import { IsNumber, IsString, Length } from 'class-validator';
import { BaseUserDto } from './base-user.dto';

export class CreateUserDto extends BaseUserDto {
  @IsNumber()
  role_id: number;

  @IsString()
  @Length(6, 46)
  password: string;
}
