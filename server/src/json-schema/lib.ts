import { Property } from './decorators/property.decorator';
import { Relationship } from './decorators/relationship.decorator';
import { Resource } from './decorators/resource.decorator';

export class JsonSchema {
	static readonly Resource = Resource;
	static readonly Property = Property;
	static readonly Relationship = Relationship;
}
