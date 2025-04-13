import { NotFoundException } from '@nestjs/common';

export type PropertyOptions = {
	title?: string;
	description?: string;
	type: string;
	format?: string;
	pattern?: string;
	defaultValue?: any;
	maxLength?: number;
	minimum?: number;
	exclusiveMinimum?: boolean;
	maximum?: number;
	exclusiveMaximum?: boolean;
	/**
	 * @default true
	 */
	required?: boolean;
	decimals?: number;
};

type RealtionshipSchema = {
	type: string;
	title?: string;
	description?: string;
	required: boolean;
};

type Schema = {
	$schema: string;
	$id: string;
	title?: string;
	description?: string;
	type: 'object';
	properties: {
		[property: string]: PropertyOptions;
	};
	required: string[];
	relationships: {
		[relation: string]: RealtionshipSchema;
	};
};

class SchemaCore {
	protected title: string = null;
	protected description: string = null;

	setTitle(title: string): void {
		this.title = title;
	}

	setDescription(description: string): void {
		this.description = description;
	}
}

class PropertyMetadata extends SchemaCore {
	private type: string = null;
	private format: string = null;
	private pattern: string = null;
	private default: any = null;
	private maxLength: number = null;
	private minimum: number = null;
	private exclusiveMinimum: boolean = false;
	private maximum: number = null;
	private exclusiveMaximum: boolean = false;
	private required: boolean = true;
	private decimals: number = null;

	setType(type: string) {
		this.type = type;
	}

	setFormat(format: string) {
		this.format = format;
	}

	setPattern(pattern: string) {
		this.pattern = pattern;
	}

	setDefault(defaultValue: any) {
		this.default = defaultValue;
	}

	setMaxLength(maxLength: number) {
		this.maxLength = maxLength;
	}

	setMinimum(minimum: number) {
		this.minimum = minimum;
	}

	setExclusiveMinimum(exclusiveMinimum: boolean) {
		this.exclusiveMinimum = exclusiveMinimum;
	}

	setMaximum(maximum: number) {
		this.maximum = maximum;
	}

	setExclusiveMaximum(exclusiveMaximum: boolean) {
		this.exclusiveMaximum = exclusiveMaximum;
	}

	setRequired(required: boolean) {
		this.required = required;
	}

	setDecimals(decimals: number) {
		this.decimals = decimals;
	}

	isRequired() {
		return this.required;
	}

	createSubSchema(): PropertyOptions {
		const schema: PropertyOptions = {
			type: this.type,
			required: this.required,
		};

		if (this.format) {
			schema.format = this.format;
		}

		if (this.pattern) {
			schema.pattern = this.pattern;
		}

		if (this.title) {
			schema.title = this.title;
		}

		if (this.description) {
			schema.description = this.description;
		}

		if (this.default) {
			schema.defaultValue = this.default;
		}

		if (this.maxLength !== undefined && this.maxLength !== null) {
			schema.maxLength = this.maxLength;
		}

		if (this.minimum !== undefined && this.minimum !== null) {
			schema.minimum = this.minimum;
			schema.exclusiveMinimum = this.exclusiveMinimum;
		}

		if (this.maximum !== undefined && this.maximum !== null) {
			schema.maximum = this.maximum;
			schema.exclusiveMaximum = this.exclusiveMaximum;
		}

		if (this.decimals !== undefined && this.decimals !== null) {
			schema.decimals = this.decimals;
		}

		return schema;
	}
}

export type RelationshipOptions = {
	type: string;
	title?: string;
	description?: string;
	/**
	 * @default false
	 */
	hasMany?: boolean;
};

class RelationshipMetadata extends SchemaCore {
	private type: string = null;
	private multiple: boolean = false;

	setType(type: string) {
		this.type = type;
	}

	setMultiple(isMultiple: boolean) {
		this.multiple = isMultiple;
	}

	createSubSchema(host: string): Promise<any> {
		const schemaStorage = getSchemaMetadataStorage();

		return new Promise((resolve) => {
			schemaStorage.getResource(this.type, (resource) => {
				resolve({
					$ref: `https://${host}/api/v2/schemas/${resource.getName()}.schema.json`,
					type: this.type,
					multiple: this.multiple,
					...(this.title ? { title: this.title } : {}),
					...(this.description ? { description: this.description } : {}),
				});
			});
		});
	}
}

type ResourceProperties = {
	[propertyName: string]: PropertyMetadata;
};

type ResourceRelationships = {
	[relationshipName: string]: RelationshipMetadata;
};

class ResourceMetadata extends SchemaCore {
	private properties: ResourceProperties;
	private relationships: ResourceRelationships;
	private readonly name: string;

	constructor(resourceName: string) {
		super();

		this.properties = {};
		this.relationships = {};
		this.name = resourceName;
	}

	getName(): string {
		return this.name;
	}

	addProperty(propertyName: string): PropertyMetadata {
		this.properties[propertyName] = new PropertyMetadata();

		return this.properties[propertyName];
	}

	addRelationship(relationshipName: string): RelationshipMetadata {
		this.relationships[relationshipName] = new RelationshipMetadata();

		return this.relationships[relationshipName];
	}

	async createSchema(host: string | null, commonSchema$?: Promise<Schema>): Promise<Schema> {
		const commonSchema = await commonSchema$;
		const required = commonSchema?.required || [];
		const relationshipsSchemas = await Promise.all(
			Object.keys(this.relationships).map((relationshipName) => {
				return this.relationships[relationshipName].createSubSchema(host);
			}),
		);

		return {
			$schema: 'https://json-schema.org/draft-04/schema#',
			$id: `https://${host}/api/v2/schemas/${this.name}.schema.json`,
			title: this.title || null,
			description: this.description || null,
			type: 'object',
			properties: Object.keys(this.properties).reduce((previous, property) => {
				previous[property] = this.properties[property].createSubSchema();

				if (this.properties[property].isRequired()) {
					required.push(property);
				}

				return previous;
			}, commonSchema?.properties || {}),
			required,
			relationships: Object.keys(this.relationships).reduce((previous, current, index) => {
				previous[current] = relationshipsSchemas[index];

				return previous;
			}, commonSchema?.relationships || {}),
		};
	}
}

type SchemaResources = {
	[resourceName: string]: ResourceMetadata;
};

type ResourceListener = (resource: ResourceMetadata) => void;

type ResourceListeners = {
	[resourceName: string]: Array<ResourceListener>;
};

export class SchemaMetadataStorage {
	private static instance: SchemaMetadataStorage;
	private resources: SchemaResources;
	private listeners: ResourceListeners;
	private resourceNames: { [className: string]: string };
	private host: string | null = null;

	static getSingleton() {
		if (!this.instance) {
			this.instance = new SchemaMetadataStorage();
		}

		return this.instance;
	}

	private constructor() {
		this.resources = {};
		this.listeners = {};
		this.resourceNames = {};
	}

	addResource(resourceName: string, resource: TFunction): ResourceMetadata {
		this.resources[resource.name] = new ResourceMetadata(resourceName);
		this.resourceNames[resourceName] = resource.name;

		if (this.listeners[resource.name]) {
			for (const listenerFn of this.listeners[resource.name]) {
				listenerFn(this.resources[resource.name]);
			}

			delete this.listeners[resource.name];
		}

		return this.resources[resource.name];
	}

	getResource(resourceName: string, callback: ResourceListener): void {
		if (this.resources[resourceName]) callback(this.resources[resourceName]);

		this.waitUntilResourceIsDefined(resourceName, callback);
	}

	private waitUntilResourceIsDefined(resourceName: string, callback: ResourceListener): void {
		const listeners = this.listeners[resourceName] || [];
		listeners.push(callback);
		this.listeners[resourceName] = listeners;
	}

	generate(resourceName: string, resourceWithCommonFields?: string): Promise<Schema> {
		const resource = this.resourceNames[resourceName];
		let commonResource: string = undefined;

		if (resourceWithCommonFields) {
			commonResource = this.resourceNames[resourceWithCommonFields];
		}

		if (!resource) {
			throw new NotFoundException(
				`Couldn't find any resource registered by the name '${resourceName}'`,
			);
		}

		return this.resources[resource].createSchema(
			this.host,
			commonResource ? this.resources[commonResource].createSchema(this.host) : undefined,
		);
	}

	setHost(host: string | null): void {
		this.host = host;
	}

	getPossibleSchemaFiles(...excludeResources: string[]): string[] {
		let resourceNames = Object.keys(this.resourceNames);

		if (excludeResources.length > 0) {
			resourceNames = resourceNames.filter((resourceName) => {
				return !excludeResources.includes(resourceName);
			});
		}

		return resourceNames.map((resourceName) => {
			return `${resourceName}.schema.json`;
		});
	}
}

export function getSchemaMetadataStorage() {
	return SchemaMetadataStorage.getSingleton();
}
