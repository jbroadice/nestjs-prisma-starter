import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard as BaseAuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JWTAuthGuard extends BaseAuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
