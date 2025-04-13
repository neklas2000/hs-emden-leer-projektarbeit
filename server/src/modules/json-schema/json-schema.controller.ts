import { Controller, Get, Headers as RequestHeaders, Param } from '@nestjs/common';

import { BehaviorSubject, Observable } from 'rxjs';

import { promiseToObervable } from '@Common/utils';
import { FileNotFoundException } from '@Exceptions/file-not-found.exception';
import {
	getSchemaMetadataStorage,
	SchemaMetadataStorage,
} from '@JsonSchema/schema-metadata-storage';

@Controller({
	path: 'schemas',
	version: '2',
})
export class JsonSchemaController {
	private readonly schemaStorage: SchemaMetadataStorage;

	constructor() {
		this.schemaStorage = getSchemaMetadataStorage();
	}

	@Get()
	readPossibleSchemas(): Observable<string[]> {
		const subject = new BehaviorSubject<string[]>(
			this.schemaStorage.getPossibleSchemaFiles('common-entity-fields'),
		);

		return subject.asObservable();
	}

	@Get(':file')
	readSchema(
		@Param('file') schemaFileName: string,
		@RequestHeaders() headers: Headers,
	): Observable<any> {
		const httpHeaders = new Headers(headers);
		this.schemaStorage.setHost(httpHeaders.get('host'));

		if (!schemaFileName.endsWith('.schema.json')) {
			throw new FileNotFoundException(schemaFileName);
		}

		const resourceName = schemaFileName.substring(0, schemaFileName.indexOf('.schema.json'));

		if (resourceName === 'common-entity-fields') {
			throw new FileNotFoundException(schemaFileName);
		}

		return promiseToObervable(this.schemaStorage.generate(resourceName, 'common-entity-fields'));
	}
}
