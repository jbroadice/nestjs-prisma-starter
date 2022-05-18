import {
  ObjectType,
  registerEnumType,
  HideField,
  Field,
} from '@nestjs/graphql';
import { Post } from 'posts/models/post.model';
import { BaseModel } from 'common/models/base.model';
import { Role } from '@prisma/client';
import { Booking } from 'bookings/models/booking.model';
import { ApiProperty, OmitType } from '@nestjs/swagger';

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType()
export class User extends BaseModel {
  @ApiProperty({ readOnly: true })
  deletedAt?: Date;

  @ApiProperty({ readOnly: true })
  email: string;

  @ApiProperty({ readOnly: true, nullable: true })
  firstname?: string;

  @ApiProperty({ readOnly: true, nullable: true })
  lastname?: string;

  @ApiProperty({ readOnly: true, enum: Role })
  @Field(() => Role)
  role: Role;

  @ApiProperty({ readOnly: true, type: () => [Post], required: false })
  posts?: Post[];

  @ApiProperty({ readOnly: true, type: () => [Booking], required: false })
  bookings?: Booking[];

  @HideField()
  password: string;
}

export class UserWithoutRelations extends OmitType(User, [
  'bookings',
  'posts',
]) {}
