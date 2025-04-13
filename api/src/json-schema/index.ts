import { Property } from './property';
import { Relationship } from './relationship';
import { Resource } from './resource';

class JsonSchema {
	static readonly Resource = Resource;
	static readonly Property = Property;
	static readonly Relationship = Relationship;
}

export { JsonSchema };
