import { Type } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class AdditionalInfoDto {
  @IsString()
  @IsOptional()
  note?: string;
}

export class BaseTransactionDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => AdditionalInfoDto)
  additional_info: AdditionalInfoDto;
}
