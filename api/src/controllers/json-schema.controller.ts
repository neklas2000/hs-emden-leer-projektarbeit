import { Controller, Get, Param, Headers as RequestHeaders } from '@nestjs/common';

import { Observable } from 'rxjs';

import {
	getSchemaMetadataStorage,
	SchemaMetadataStorage,
} from 'json-schema/schema-metadata-storage';
import { promiseToObservable } from '@Utils/promise-to-oberservable';

@Controller({
	path: 'schemas',
	version: '2',
})
export class JsonSchemaController {
	private readonly schemaStorage: SchemaMetadataStorage;

	constructor() {
		this.schemaStorage = getSchemaMetadataStorage();
	}

	@Get(':file')
	readSchema(
		@Param('file') schemaFile: string,
		@RequestHeaders() headers: Headers,
	): Observable<any> {
		const httpHeaders = new Headers(headers);
		this.schemaStorage.setHost(httpHeaders.get('host'));
		let schema$;

		if (schemaFile.endsWith('.schema.json')) {
			schema$ = this.schemaStorage.generate(
				schemaFile.substring(0, schemaFile.indexOf('.schema.json')),
			);
		} else if (schemaFile.endsWith('.json')) {
			schema$ = this.schemaStorage.generate(schemaFile.substring(0, schemaFile.indexOf('.json')));
		} else {
			schema$ = this.schemaStorage.generate(schemaFile);
		}

		return promiseToObservable(schema$);
	}
}
