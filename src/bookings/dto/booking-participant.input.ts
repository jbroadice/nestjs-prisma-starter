import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ParticipantRole } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';

@InputType()
export class BookingParticipantInput {
  @ApiProperty()
  @Field()
  @IsNotEmpty()
  participantId: string;
  @ApiProperty({ enum: ParticipantRole })
  @Field(() => ParticipantRole)
  @IsEnum(ParticipantRole)
  participantRole: ParticipantRole;
}

@InputType()
export class BookingParticipantsInput {
  @ApiProperty({ type: [BookingParticipantInput] })
  @Field(() => [BookingParticipantInput])
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BookingParticipantInput)
  participants: BookingParticipantInput[];
}
