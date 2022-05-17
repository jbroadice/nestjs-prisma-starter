import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @ApiProperty({ nullable: true })
  @MinLength(2)
  firstname?: string;

  @Field({ nullable: true })
  @ApiProperty({ nullable: true })
  @MinLength(2)
  lastname?: string;

  @ApiProperty({ enum: Role })
  @Field(() => Role)
  @IsEnum(Role)
  role: Role;
}
