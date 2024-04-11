import { userFactory } from './user.decorator';

describe('Decorator: User', () => {
	it('should return the value of the requests property "user"', () => {
		const httpContext = {
			getRequest: () => {
				return {
					user: 'This is the user',
				};
			},
		} as any;
		const context = {
			switchToHttp: () => httpContext,
		} as any;

		jest.spyOn(httpContext, 'getRequest');
		jest.spyOn(context, 'switchToHttp');

		const user = userFactory(null, context);

		expect(context.switchToHttp).toHaveBeenCalledTimes(1);
		expect(httpContext.getRequest).toHaveBeenCalledTimes(1);
		expect(user).toEqual('This is the user');
	});
});
