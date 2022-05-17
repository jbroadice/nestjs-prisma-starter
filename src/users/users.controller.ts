import { Controller, Get, Request, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JWTGuard } from 'auth/jwt-guard.decorator';
import { ApiPaginatedResponse } from 'common/pagination/api-paginated-response.decorator';
import { PaginationQueryDto } from 'common/pagination/pagination-query.dto';
import { UserWithoutRelations } from './models/user.model';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@JWTGuard()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiPaginatedResponse(UserWithoutRelations)
  users(
    @Query()
    paginationQuery: PaginationQueryDto
  ) {
    return this.usersService.findAll(paginationQuery);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ type: UserWithoutRelations })
  async getMe(@Request() req): Promise<UserWithoutRelations> {
    return req.user;
  }
}
