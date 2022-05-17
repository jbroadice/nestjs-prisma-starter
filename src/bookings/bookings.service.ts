import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Booking, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import {
  makePaginatedResponse,
  PrismaDelegateRejectSettings,
} from 'common/pagination/paginated-dto';
import { PaginationQueryDto } from 'common/pagination/pagination-query.dto';
import { uniqWith } from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { BookingParticipantInput } from './dto/booking-participant.input';
import { BookingParticipantsCreatedOutput } from './dto/booking-participants-created.output';
import { CreateBookingInput } from './dto/create-booking.input';

export interface IBookingsFilters {
  /**
   * List of participant ids.
   */
  participants?: string[];
  active?: boolean;
}

const INCLUDED_RELATIONS = {
  participants: { include: { participant: true, assignedBy: true } },
};

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find all bookings.
   */
  findFiltered(
    { participants, active }: IBookingsFilters,
    paginationQuery: PaginationQueryDto
  ) {
    return makePaginatedResponse<
      Booking,
      Prisma.BookingDelegate<PrismaDelegateRejectSettings>,
      Prisma.BookingWhereInput,
      Prisma.BookingFindManyArgs
    >({
      paginationQuery,
      modelDelegate: this.prisma.booking,
      whereGetter: () => {
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
        return where;
      },
      argsGetter: () => ({ include: INCLUDED_RELATIONS }),
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
        throw new UnprocessableEntityException(
          'Cannot assign organiser to booking before unassigning existing organiser'
        );
      }
    } else if (organisers.length > 1) {
      throw new UnprocessableEntityException(
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
            throw new UnprocessableEntityException('Invalid participant(s)');
        }
      }
      throw e;
    }
  }
}
