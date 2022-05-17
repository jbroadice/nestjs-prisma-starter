import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @ApiProperty({
    default: 0,
    minimum: 0,
    maximum: 1000,
    exclusiveMaximum: true,
    exclusiveMinimum: true,
    format: 'int32',
    description: 'Pagination: Number of records to skip / offset',
    required: false,
  })
  @Type(() => Number)
  skip: number = 0;

  @ApiProperty({
    default: 10,
    minimum: 0,
    maximum: 1000,
    exclusiveMaximum: true,
    exclusiveMinimum: true,
    format: 'int32',
    description: 'Pagination: Number of records to retrieve / limit',
    required: false,
  })
  @Type(() => Number)
  take: number = 10;
}
