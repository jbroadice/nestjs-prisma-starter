import { Inject, Injectable, Scope, Request } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from './pagination-query.dto';
import { Request as ExpressRequest } from 'express';

export interface IPrismaFacadeDelegate<TModel, TFindManyArgs> {
  count(args?: unknown): Promise<number>;
  findMany(args?: TFindManyArgs): Promise<TModel[]>;
}

export type PrismaDelegateRejectSettings =
  | Prisma.RejectOnNotFound
  | Prisma.RejectPerOperation;

export interface IMakePaginatedResponse<
  TModel,
  TModelDelegate extends IPrismaFacadeDelegate<TModel, TFindManyArgs>,
  TWhereInput,
  TFindManyArgs
> {
  paginationQuery: PaginationQueryDto;
  modelDelegate: TModelDelegate;
  args?: TFindManyArgs;
  where?: TWhereInput;
}

@Injectable({ scope: Scope.REQUEST })
export class PaginationService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  async makePaginatedResponse<
    TModel,
    TModelDelegate extends IPrismaFacadeDelegate<TModel, TFindManyArgs>,
    TWhereInput = unknown,
    TFindManyArgs = unknown
  >({
    paginationQuery: { skip, take },
    modelDelegate,
    args = null,
    where = null,
  }: IMakePaginatedResponse<
    TModel,
    TModelDelegate,
    TWhereInput,
    TFindManyArgs
  >) {
    const total = await modelDelegate.count({ where });
    const prev = skip - take;
    const next = skip + take;

    const req = this.request as unknown as ExpressRequest;
    const baseUrl = `${req.protocol}://${req.get('Host')}${req.baseUrl}${
      req.path
    }`;

    const getUrl = (skip: number) => {
      const query = new URLSearchParams({
        ...req.query,
        skip: skip.toString(),
        take: take.toString(),
      });
      return `${baseUrl}?${query.toString()}`;
    };

    return {
      meta: {
        limit: take,
        offset: skip,
        total,
        prev: prev >= 0 && prev < total ? getUrl(prev) : null,
        next: next < total ? getUrl(next) : null,
      },
      results: await modelDelegate.findMany({
        ...args,
        where,
        skip,
        take,
      }),
    };
  }
}
