import { ObjectType } from '@nestjs/graphql';
import { User } from 'users/models/user.model';
import { BaseModel } from 'common/models/base.model';
import { ApiResponseProperty } from '@nestjs/swagger';

@ObjectType()
export class Post extends BaseModel {
  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty()
  content: string;

  @ApiResponseProperty()
  published: boolean;

  @ApiResponseProperty({ type: () => User })
  author: User;
}
