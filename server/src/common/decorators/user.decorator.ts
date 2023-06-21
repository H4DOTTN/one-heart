import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const Request = context.switchToHttp().getRequest();
    if (!data) return Request.user;
    return Request.user[data];
  },
);
