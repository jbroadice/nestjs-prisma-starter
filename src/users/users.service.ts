import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException, Scope } from '@nestjs/common';
import { PasswordService } from 'auth/password.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PaginationQueryDto } from 'common/pagination/pagination-query.dto';
import { UserWithoutRelations } from './models/user.model';
import { Prisma } from '@prisma/client';
import { UsersFiltersDto } from './dto/users-filters.dto';
import {
  PaginationService,
  PrismaDelegateRejectSettings,
} from 'common/pagination/pagination.service';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly paginationService: PaginationService
  ) {}

  /**
   * Find all users.
   */
  findAll({ emails }: UsersFiltersDto, paginationQuery: PaginationQueryDto) {
    return this.paginationService.makePaginatedResponse<
      UserWithoutRelations,
      Prisma.UserDelegate<PrismaDelegateRejectSettings>,
      Prisma.UserWhereInput
    >({
      paginationQuery,
      modelDelegate: this.prisma.user,
      where: { email: { in: emails } },
    });
  }

  /**
   * Find users by email address.
   */
  findByEmails(emails: string[]) {
    return this.prisma.user.findMany({ where: { email: { in: emails } } });
  }

  /**
   * Update user.
   */
  updateUser(userId: string, newUserData: UpdateUserInput) {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }

  /**
   * Change a user's password.
   */
  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }

  /**
   * Delete a user.
   */
  deleteUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
