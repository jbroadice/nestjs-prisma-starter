import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';
import { Booking } from './models/booking.model';

@Resolver(() => Booking)
export class BookingsResolver {
  constructor(private readonly prisma: PrismaService) {}

  @ResolveField('participants')
  async participants(@Parent() booking: Booking) {
    return this.prisma.booking
      .findUnique({
        where: { id: booking.id },
      })
      .participants();
  }
}
