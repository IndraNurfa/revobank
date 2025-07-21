import { IsString, IsDateString } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;
  @IsDateString()
  birthdate: string;
  @IsString()
  breed: string;
}
