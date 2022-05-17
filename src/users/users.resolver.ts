import { PrismaService } from 'nestjs-prisma';
import {
  Resolver,
  Query,
  Parent,
  Mutation,
  Args,
  ResolveField,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'common/decorators/user.decorator';
import { JWTAuthGuard } from 'auth/auth.guard';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Booking } from 'bookings/models/booking.model';
import { CreateBookingInput } from 'bookings/dto/create-booking.input';
import { BookingsService } from 'bookings/bookings.service';

@Resolver(() => User)
@UseGuards(JWTAuthGuard)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private bookingsService: BookingsService,
    private prisma: PrismaService
  ) {}

  @Query(() => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @ResolveField('fullname', () => String)
  fullname(@Parent() user: User) {
    return `${user.firstname} ${user.lastname}`;
  }

  @UseGuards(JWTAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @UserEntity() user: User,
    @Args('data') newUserData: UpdateUserInput
  ) {
    return this.usersService.updateUser(user.id, newUserData);
  }

  @UseGuards(JWTAuthGuard)
  @Mutation(() => User)
  async changePassword(
    @UserEntity() user: User,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return this.usersService.changePassword(
      user.id,
      user.password,
      changePassword
    );
  }

  @ResolveField('posts')
  posts(@Parent() author: User) {
    return this.prisma.user.findUnique({ where: { id: author.id } }).posts();
  }

  @ResolveField('bookings', () => [Booking])
  bookings(@Parent() participant: User) {
    return this.prisma.user
      .findUnique({
        where: { id: participant.id },
      })
      .bookings();
  }

  @UseGuards(JWTAuthGuard)
  @Mutation(() => Booking)
  async createBooking(
    @UserEntity() user: User,
    @Args('data') bookingData: CreateBookingInput
  ) {
    return this.bookingsService.createBooking(user.id, bookingData);
  }
}
