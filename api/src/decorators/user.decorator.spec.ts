import { userFactory } from '@Decorators/user.decorator';

describe('Decorator: User', () => {
	it('should return the value of the requests property "user"', () => {
		const httpContext = {
			getRequest: () => {
				return {
					user: {
						id: '1',
						firstName: 'Max',
						lastName: 'Mustermann',
					},
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
		expect(user).toEqual({
			id: '1',
			firstName: 'Max',
			lastName: 'Mustermann',
		});
	});
});
