import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Query,
  Delete,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Booking } from './models/booking.model';
import { CreateBookingInput } from './dto/create-booking.input';
import { BookingsService } from './bookings.service';
import { BookingParticipantsInput } from './dto/booking-participant.input';
import { BookingParticipantsCreatedOutput } from './dto/booking-participants-created.output';
import { ApiPaginatedResponse } from 'common/pagination/api-paginated-response.decorator';
import { JWTGuard } from 'auth/jwt-guard.decorator';
import { BookingsFiltersPaginatedDto } from './dto/bookings-filters.dto';
import { UpdateBookingInput } from './dto/update-booking.input';

@ApiTags('Bookings')
@Controller('bookings')
@JWTGuard()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Get all bookings.
   */
  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiQuery({
    name: 'participants',
    style: 'simple',
    required: false,
  })
  @ApiPaginatedResponse(Booking)
  bookings(
    @Query()
    { participants, active, date, skip, take }: BookingsFiltersPaginatedDto
  ) {
    return this.bookingsService.findFiltered(
      {
        participants,
        active,
        date,
      },
      { skip, take }
    );
  }

  /**
   * Create a new booking.
   */
  @Post('booking')
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiCreatedResponse({ type: Booking })
  @ApiBadRequestResponse({ description: 'Could not create booking' })
  create(@Body() booking: CreateBookingInput, @Request() req) {
    return this.bookingsService.createBooking(req.user.id, booking);
  }

  /**
   * Get an individual booking.
   */
  @Get('booking/:id')
  @ApiOperation({
    summary: 'Get a booking',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the booking',
    example: 'cl37ynt5m0017s2ec6tmdfqo0',
  })
  @ApiOkResponse({ type: Booking })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  async getBooking(@Param('id') id: string) {
    const booking = await this.bookingsService.findOneById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return booking;
  }

  /**
   * Update a booking.
   */
  @Patch('booking/:id')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiParam({
    name: 'id',
    description: 'The id of the booking',
    example: 'cl37ynt5m0017s2ec6tmdfqo0',
  })
  @ApiOkResponse({ type: Booking })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  @ApiConflictResponse({ description: 'Booking update conflict' })
  @ApiBadRequestResponse({ description: 'Could not update booking' })
  updateBooking(@Param('id') id: string, @Body() booking: UpdateBookingInput) {
    return this.bookingsService.updateBooking(id, booking);
  }

  /**
   * Add participants to a booking.
   */
  @Post('booking/:id/participants')
  @ApiOperation({
    summary: 'Add participants to a booking',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the booking',
    example: 'cl37ynt5m0017s2ec6tmdfqo0',
  })
  @ApiCreatedResponse({ type: BookingParticipantsCreatedOutput })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  @ApiConflictResponse({ description: 'Participants update conflict' })
  @ApiBadRequestResponse({ description: 'Could not update participants' })
  addParticipant(
    @Param('id') id: string,
    @Body() { participants }: BookingParticipantsInput,
    @Request() req
  ) {
    return this.bookingsService.addParticipants(id, req.user.id, participants);
  }

  /**
   * Delete a booking.
   */
  @Delete('booking/:id')
  @ApiOperation({
    summary: 'Delete a booking',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the booking',
    example: 'cl37ynt5m0017s2ec6tmdfqo0',
  })
  @ApiOkResponse({ type: Booking })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  @ApiBadRequestResponse({ description: 'Could not delete booking' })
  deleteBooking(@Param('id') id: string) {
    return this.bookingsService.deleteBooking(id);
  }
}
