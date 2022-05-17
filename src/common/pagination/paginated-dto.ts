import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMeta {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}

export class PaginatedDto<TData> {
  @ApiProperty()
  meta: PaginatedMeta;

  @ApiProperty()
  results: TData[];
}
