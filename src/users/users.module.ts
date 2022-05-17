import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PasswordService } from 'auth/password.service';
import { BookingsModule } from 'bookings/bookings.module';
import { UsersController } from './users.controller';

@Module({
  imports: [BookingsModule],
  controllers: [UsersController],
  providers: [UsersResolver, UsersService, PasswordService],
})
export class UsersModule {}
