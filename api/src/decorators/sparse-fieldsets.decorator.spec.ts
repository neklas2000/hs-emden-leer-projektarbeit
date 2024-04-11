import { sparseFieldsetsFactory } from './sparse-fieldsets.decorator';

describe('Decorator: SparseFieldsets', () => {
	it('should return all fields which were requested', () => {
		const report = {
			getColumns: () => ['id', 'title'],
			getRelationTypes: () => ({}),
		} as any;
		const project = {
			getColumns: () => ['id', 'name', 'sequenceNumber'],
			getRelationTypes: () => ({
				report,
			}),
		} as any;
		const entity = {
			getColumns: () => ['id', 'name'],
			getRelationTypes: () => ({
				project,
			}),
			name: 'User',
		} as any;
		const httpContext = {
			getRequest: () => {
				return {
					query: {
						fields: {
							user: 'id,name,nonExisting',
							project: ['id', 'name,sequenceNumber,nonExisting'],
							'project.report': 'id,title,nonExisting',
							relationC: 'id',
						},
					},
				};
			},
		} as any;
		const context = {
			switchToHttp: () => httpContext,
		} as any;

		jest.spyOn(report, 'getColumns');
		jest.spyOn(project, 'getColumns');
		jest.spyOn(project, 'getRelationTypes');
		jest.spyOn(entity, 'getColumns');
		jest.spyOn(entity, 'getRelationTypes');
		jest.spyOn(httpContext, 'getRequest');
		jest.spyOn(context, 'switchToHttp');

		const sparseFieldsetsOptions = sparseFieldsetsFactory(entity, context);

		expect(context.switchToHttp).toHaveBeenCalledTimes(1);
		expect(httpContext.getRequest).toHaveBeenCalledTimes(1);
		expect(entity.getColumns).toHaveBeenCalledTimes(1);
		expect(entity.getRelationTypes).toHaveBeenCalledTimes(3);
		expect(project.getColumns).toHaveBeenCalledTimes(1);
		expect(project.getRelationTypes).toHaveBeenCalledTimes(1);
		expect(report.getColumns).toHaveBeenCalledTimes(1);
		expect(sparseFieldsetsOptions).toEqual({
			id: true,
			name: true,
			project: {
				id: true,
				name: true,
				sequenceNumber: true,
				report: {
					id: true,
					title: true,
				},
			},
			relationC: {},
		});
	});
});
