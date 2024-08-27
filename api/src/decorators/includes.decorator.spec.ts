import { includesFactory } from '@Decorators/includes.decorator';

describe('Decorator: Includes', () => {
	it('should return all relations based on a single string', () => {
		const relationC = {
			getRelations: () => ['relationD'],
		} as any;
		const entity = {
			getRelations: () => ['relationA', 'relationB', 'relationC'],
			getRelationTypes: () => ({
				relationC,
			}),
		} as any;
		const httpContext = {
			getRequest: () => {
				return {
					query: {
						include: 'relationA,relationB,relationC.relationD',
					},
				};
			},
		} as any;
		const context = {
			switchToHttp: () => httpContext,
		} as any;

		jest.spyOn(httpContext, 'getRequest');
		jest.spyOn(context, 'switchToHttp');

		const includeOptions = includesFactory(entity, context);

		expect(context.switchToHttp).toHaveBeenCalledTimes(1);
		expect(httpContext.getRequest).toHaveBeenCalledTimes(1);
		expect(includeOptions).toEqual({
			relationA: true,
			relationB: true,
			relationC: {
				relationD: true,
			},
		});
	});

	it("should return an empty object of relations based of an array of relations, but they didn't exist", () => {
		const entity = {
			getRelations: () => [],
		} as any;
		const httpContext = {
			getRequest: () => {
				return {
					query: {
						include: ['relationA', 'relationB'],
					},
				};
			},
		} as any;
		const context = {
			switchToHttp: () => httpContext,
		} as any;

		jest.spyOn(httpContext, 'getRequest');
		jest.spyOn(context, 'switchToHttp');

		const includeOptions = includesFactory(entity, context);

		expect(context.switchToHttp).toHaveBeenCalled();
		expect(httpContext.getRequest).toHaveBeenCalled();
		expect(includeOptions).toEqual({});
	});
});
