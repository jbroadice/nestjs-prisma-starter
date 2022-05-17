import { ApiProperty } from '@nestjs/swagger';

export class BookingParticipantsCreatedOutput {
  @ApiProperty({ minimum: 1, readOnly: true })
  count: number;
}
