import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from 'common/pagination/pagination-query.dto';

export class UsersFiltersDto {
  @ApiProperty({ description: 'Filter by list of participant emails' })
  @Transform(({ value }) => value.split(','))
  emails?: string[];
}

export class UsersFiltersPaginatedDto extends IntersectionType(
  UsersFiltersDto,
  PaginationQueryDto
) {}
