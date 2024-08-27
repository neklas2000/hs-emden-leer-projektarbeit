import { filtersFactory } from '@Decorators/filters.decorator';

describe('Decorator: Filters', () => {
	it('should return all conditions', () => {
		const owner = {
			getProperties: () => ['id'],
		} as any;
		const entity = {
			getProperties: () => ['id', 'owner'],
			getRelationTypes: () => ({
				owner,
			}),
		} as any;
		const httpContext = {
			getRequest: () => {
				return {
					query: {
						filter: {
							id: '1',
							'owner.id': '2',
						},
					},
				};
			},
		} as any;
		const context = {
			switchToHttp: () => httpContext,
		} as any;

		jest.spyOn(httpContext, 'getRequest');
		jest.spyOn(context, 'switchToHttp');

		const whereOptions = filtersFactory(entity, context);

		expect(context.switchToHttp).toHaveBeenCalledTimes(1);
		expect(httpContext.getRequest).toHaveBeenCalledTimes(1);
		expect(whereOptions).toEqual({
			id: '1',
			owner: {
				id: '2',
			},
		});
	});

	it("should return an empty object of conditions since the property didn't exist", () => {
		const entity = {
			getProperties: () => [],
		} as any;
		const httpContext = {
			getRequest: () => {
				return {
					query: {
						filter: {
							id: '1',
						},
					},
				};
			},
		} as any;
		const context = {
			switchToHttp: () => httpContext,
		} as any;

		jest.spyOn(httpContext, 'getRequest');
		jest.spyOn(context, 'switchToHttp');

		const whereOptions = filtersFactory(entity, context);

		expect(context.switchToHttp).toHaveBeenCalled();
		expect(httpContext.getRequest).toHaveBeenCalled();
		expect(whereOptions).toEqual({});
	});
});
