import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from 'common/pagination/pagination-query.dto';

export class BookingsFiltersDto {
  @ApiProperty({
    description: 'Filter by list of participant ids',
  })
  @Transform(({ value }) => value.split(','))
  participants?: string[];

  @ApiProperty({ description: 'Filter by active status' })
  active?: boolean;

  @ApiProperty({ description: 'Filter by booking date' })
  date?: Date;
}

export class BookingsFiltersPaginatedDto extends IntersectionType(
  BookingsFiltersDto,
  PaginationQueryDto
) {}
