import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from './pagination-query.dto';

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

export interface PrismaFacadeDelegate<TModel, TFindManyArgs> {
  count(args?: unknown): Promise<number>;
  findMany(args?: TFindManyArgs): Promise<TModel[]>;
}

export type PrismaDelegateRejectSettings =
  | Prisma.RejectOnNotFound
  | Prisma.RejectPerOperation;

export interface IMakePaginatedResponse<
  TModel,
  TModelDelegate extends PrismaFacadeDelegate<TModel, TFindManyArgs>,
  TWhereInput,
  TFindManyArgs
> {
  paginationQuery: PaginationQueryDto;
  modelDelegate: TModelDelegate;
  argsGetter?: () => TFindManyArgs;
  whereGetter?: () => TWhereInput;
}

export async function makePaginatedResponse<
  TModel,
  TModelDelegate extends PrismaFacadeDelegate<TModel, TFindManyArgs>,
  TWhereInput = unknown,
  TFindManyArgs = unknown
>({
  paginationQuery,
  modelDelegate,
  argsGetter = null,
  whereGetter = null,
}: IMakePaginatedResponse<TModel, TModelDelegate, TWhereInput, TFindManyArgs>) {
  const where = whereGetter ? whereGetter() : undefined;
  return {
    meta: {
      limit: paginationQuery.take,
      offset: paginationQuery.skip,
      total: await modelDelegate.count({ where }),
    },
    results: await modelDelegate.findMany({
      ...(argsGetter && argsGetter()),
      where,
      ...paginationQuery,
    }),
  };
}
