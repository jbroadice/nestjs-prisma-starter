import { Field, ObjectType, ID } from '@nestjs/graphql';
import { ApiResponseProperty } from '@nestjs/swagger';

@ObjectType({ isAbstract: true })
export abstract class BaseModel {
  /**
   * The id of the model.
   */
  @ApiResponseProperty()
  @Field(() => ID)
  id: string;
  @Field({
    description: 'Identifies the date and time when the object was created.',
  })

  /**
   * Identifies the date and time when the object was created.
   */
  @ApiResponseProperty()
  createdAt: Date;
  @Field({
    description:
      'Identifies the date and time when the object was last updated.',
  })

  /**
   * Identifies the date and time when the object was last updated.
   */
  @ApiResponseProperty()
  updatedAt: Date;
}
