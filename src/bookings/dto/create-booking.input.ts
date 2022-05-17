import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateBookingInput {
  @ApiProperty()
  @Field()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  @Field()
  description?: string;
  @ApiProperty()
  @Field()
  @IsDateString()
  timeStart: Date;
  @ApiProperty()
  @Field()
  @IsDateString()
  timeEnd: Date;
}
