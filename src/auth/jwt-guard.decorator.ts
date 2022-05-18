import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JWTAuthGuard } from './auth.guard';

export const JWTGuard = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'JWT Unauthorised' }),
    UseGuards(JWTAuthGuard)
  );
