import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({
    example: 'Sanity Test',
    description: 'Optional note or description for the transaction.',
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class BaseTransactionDto {
  @ApiProperty({
    example: 15000,
    description:
      'The transaction amount. Must be greater than or equal to 0.01.',
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({
    type: AdditionalInfoDto,
    description: 'Additional optional information about the transaction.',
  })
  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => AdditionalInfoDto)
  additional_info: AdditionalInfoDto;
}
