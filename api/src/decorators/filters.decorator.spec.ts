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

		jest.spyOn(owner, 'getProperties');
		jest.spyOn(entity, 'getProperties');
		jest.spyOn(entity, 'getRelationTypes');
		jest.spyOn(httpContext, 'getRequest');
		jest.spyOn(context, 'switchToHttp');

		const whereOptions = filtersFactory(entity, context);

		expect(context.switchToHttp).toHaveBeenCalledTimes(1);
		expect(httpContext.getRequest).toHaveBeenCalledTimes(1);
		expect(entity.getProperties).toHaveBeenCalledTimes(2);
		expect(owner.getProperties).toHaveBeenCalledTimes(1);
		expect(entity.getRelationTypes).toHaveBeenCalledTimes(1);
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

		jest.spyOn(entity, 'getProperties');
		jest.spyOn(httpContext, 'getRequest');
		jest.spyOn(context, 'switchToHttp');

		const whereOptions = filtersFactory(entity, context);

		expect(context.switchToHttp).toHaveBeenCalled();
		expect(httpContext.getRequest).toHaveBeenCalled();
		expect(entity.getProperties).toHaveBeenCalled();
		expect(whereOptions).toEqual({});
	});
});
