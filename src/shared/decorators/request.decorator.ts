import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestItem = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[data];
  },
);