import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const userFactory = (data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();

	return request.user;
};

export const User = createParamDecorator(userFactory);
