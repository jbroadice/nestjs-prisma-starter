import { Controller, Get, Request, Query, Patch, Body } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
  ApiConflictResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JWTGuard } from 'auth/jwt-guard.decorator';
import { ApiPaginatedResponse } from 'common/pagination/api-paginated-response.decorator';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersFiltersPaginatedDto } from './dto/users-filters.dto';
import { UserWithoutRelations } from './models/user.model';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@JWTGuard()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users.
   */
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'emails', style: 'simple', required: false })
  @ApiPaginatedResponse(UserWithoutRelations)
  users(
    @Query()
    { emails, skip, take }: UsersFiltersPaginatedDto
  ) {
    return this.usersService.findAll({ emails }, { skip, take });
  }

  /**
   * Get the current logged in user.
   */
  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ type: UserWithoutRelations })
  getMe(@Request() req): Promise<UserWithoutRelations> {
    return req.user;
  }

  /**
   * Update user.
   */
  @Patch('user/:id')
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ type: UserWithoutRelations })
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  updateUser(@Query('id') id: string, @Body() user: UpdateUserInput) {
    return this.usersService.updateUser(id, user);
  }
}
