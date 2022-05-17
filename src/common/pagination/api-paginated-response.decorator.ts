import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedDto, PaginatedMeta } from './paginated-dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedDto, PaginatedMeta),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              meta: {
                type: 'object',
                $ref: getSchemaPath(PaginatedMeta),
              },
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    })
  );
};
