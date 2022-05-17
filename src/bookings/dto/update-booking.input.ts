import { PartialType } from '@nestjs/swagger';
import { CreateBookingInput } from './create-booking.input';

export class UpdateBookingInput extends PartialType(CreateBookingInput) {}
