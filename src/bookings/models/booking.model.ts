import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiResponseProperty, OmitType } from '@nestjs/swagger';
import {
  ParticipantRole,
  ParticipantsOnBookings as IParticipantsOnBookings,
} from '@prisma/client';
import { BaseModel } from 'common/models/base.model';
import { User, UserWithoutRelations } from 'users/models/user.model';

registerEnumType(ParticipantRole, {
  name: 'ParticipantRole',
  description: 'Participant role on booking',
});

@ObjectType()
export class ParticipantsOnBookings implements IParticipantsOnBookings {
  @ApiResponseProperty()
  participantId: string;

  @ApiResponseProperty({ enum: ParticipantRole })
  @Field(() => ParticipantRole)
  participantRole: ParticipantRole;

  @ApiResponseProperty()
  assignedAt: Date;

  @ApiResponseProperty()
  assignedById: string;

  @ApiResponseProperty()
  bookingId: string;

  @ApiResponseProperty({ type: () => UserWithoutRelations })
  @Field(() => User)
  participant: UserWithoutRelations;

  @ApiResponseProperty({ type: () => UserWithoutRelations })
  @Field(() => User)
  assignedBy: UserWithoutRelations;
}

@ObjectType()
export class Booking extends BaseModel {
  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty()
  description?: string;

  @ApiResponseProperty()
  active: boolean;

  @ApiResponseProperty()
  timeStart: Date;

  @ApiResponseProperty({ type: Date })
  timeEnd: Date;

  @ApiResponseProperty({ type: () => ParticipantsOnBookings })
  @Field(() => ParticipantsOnBookings)
  participants: ParticipantsOnBookings;
}

export class BookingWithoutParticipants extends OmitType(Booking, [
  'participants',
]) {}
