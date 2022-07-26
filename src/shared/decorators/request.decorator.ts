import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const RequestItem = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[data];
  },
);

export const GraphqlRequestItem = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = GqlExecutionContext.create(ctx).getContext().req
    return request[data];
  },
);