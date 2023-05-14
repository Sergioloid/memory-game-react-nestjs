import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CONNECTED_USER = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.foundUser; // extract token from request
    },
);