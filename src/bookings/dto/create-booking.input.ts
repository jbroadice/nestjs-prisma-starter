import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateBookingInput {
  @ApiProperty()
  @Field()
  @IsNotEmpty()
  @MinLength(2)
  title: string;
  @ApiProperty()
  @Field()
  @IsString()
  @MinLength(5)
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
