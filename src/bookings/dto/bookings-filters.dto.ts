import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from 'common/pagination/pagination-query.dto';

export class BookingsFiltersDto {
  @ApiProperty()
  @Transform(({ value }) => value.split(','))
  participants?: string[];

  @ApiProperty()
  active?: boolean;
}

export class BookingsFiltersPaginatedDto extends IntersectionType(
  BookingsFiltersDto,
  PaginationQueryDto
) {}
