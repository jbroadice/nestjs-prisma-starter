import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from 'auth/password.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PaginationQueryDto } from 'common/pagination/pagination-query.dto';
import { UserWithoutRelations } from './models/user.model';
import {
  makePaginatedResponse,
  PrismaDelegateRejectSettings,
} from 'common/pagination/paginated-dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService
  ) {}

  /**
   * Find all users.
   */
  findAll(paginationQuery: PaginationQueryDto) {
    return makePaginatedResponse<
      UserWithoutRelations,
      Prisma.UserDelegate<PrismaDelegateRejectSettings>
    >({
      paginationQuery,
      modelDelegate: this.prisma.user,
    });
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
}
