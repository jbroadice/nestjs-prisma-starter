import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Booking, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PaginationQueryDto } from 'common/pagination/pagination-query.dto';
import {
  PaginationService,
  PrismaDelegateRejectSettings,
} from 'common/pagination/pagination.service';
import { getDateRangeFromDate } from 'common/utils/date.utils';
import { uniqWith } from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { BookingParticipantInput } from './dto/booking-participant.input';
import { BookingParticipantsCreatedOutput } from './dto/booking-participants-created.output';
import { BookingsFiltersDto } from './dto/bookings-filters.dto';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';

const INCLUDED_RELATIONS = {
  participants: { include: { participant: true, assignedBy: true } },
};

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService
  ) {}

  /**
   * Find all bookings.
   */
  findFiltered(
    { participants, active, date }: BookingsFiltersDto,
    paginationQuery: PaginationQueryDto
  ) {
    const whereGetter = () => {
      const where: Prisma.BookingWhereInput = {};
      if (participants !== undefined) {
        where.participants = {
          some: {
            participant: { id: { in: participants } },
          },
        };
      }
      if (active !== undefined) {
        where.active = active;
      }
      if (date !== undefined) {
        const { start, end } = getDateRangeFromDate(date);
        where.timeStart = { gte: start };
        where.timeEnd = { lte: end };
      }
      return where;
    };
    return this.paginationService.makePaginatedResponse<
      Booking,
      Prisma.BookingDelegate<PrismaDelegateRejectSettings>,
      Prisma.BookingWhereInput,
      Prisma.BookingFindManyArgs
    >({
      paginationQuery,
      modelDelegate: this.prisma.booking,
      where: whereGetter(),
      args: { include: INCLUDED_RELATIONS },
    });
  }

  /**
   * Find a booking by id.
   */
  findOneById(id: string, options = { includeRelations: true }) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: options.includeRelations && INCLUDED_RELATIONS,
    });
  }

  /**
   * Delete a booking by id.
   */
  async deleteBooking(id: string) {
    await this.prisma.participantsOnBookings.deleteMany({
      where: { bookingId: id },
    });
    return this.prisma.booking.delete({
      where: { id },
    });
  }

  /**
   * Create a new booking.
   */
  async createBooking(userId: string, newBookingData: CreateBookingInput) {
    const create = await this.prisma.participantsOnBookings.create({
      data: {
        participantRole: 'ORGANISER',
        booking: { create: newBookingData },
        participant: { connect: { id: userId } },
        assignedBy: { connect: { id: userId } },
      },
      include: { participant: true, booking: true, assignedBy: true },
    });

    return this.findOneById(create.booking.id);
  }

  /**
   * Update a booking.
   */
  async updateBooking(id: string, data: UpdateBookingInput): Promise<Booking> {
    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data,
    });

    return this.findOneById(updatedBooking.id);
  }

  /**
   * Add participants to a booking.
   */
  async addParticipants(
    bookingId: string,
    assignedById: string,
    participants: BookingParticipantInput[]
  ): Promise<BookingParticipantsCreatedOutput> {
    if (!(await this.findOneById(bookingId, { includeRelations: false }))) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    const participantsUnique = uniqWith(
      participants,
      (a, b) =>
        a.participantId === b.participantId &&
        a.participantRole === b.participantRole
    );
    const organisers = participantsUnique.filter(
      (p) => p.participantRole === 'ORGANISER'
    );
    if (organisers.length === 1) {
      const organiser = await this.prisma.participantsOnBookings.findFirst({
        where: { booking: { id: bookingId }, participantRole: 'ORGANISER' },
      });
      if (organiser) {
        throw new BadRequestException(
          'Cannot assign organiser to booking before unassigning existing organiser'
        );
      }
    } else if (organisers.length > 1) {
      throw new BadRequestException(
        'Cannot assign more than one organiser to a booking'
      );
    }

    try {
      return await this.prisma.participantsOnBookings.createMany({
        data: [
          ...participantsUnique.map(
            ({
              participantId,
              participantRole,
            }): Prisma.ParticipantsOnBookingsCreateManyInput => ({
              bookingId,
              participantId,
              participantRole,
              assignedById,
            })
          ),
        ],
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2002':
            throw new ConflictException(
              'Participant(s) already assigned to booking'
            );
          case 'P2003':
            throw new ConflictException('Invalid participant(s)');
        }
      }
      throw e;
    }
  }
}
