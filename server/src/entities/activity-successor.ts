import { Entity, ManyToOne } from 'typeorm';

import { JsonSchema } from '@JsonSchema/lib';
import { CommonEntityFields } from './common-entity-fields';
import { ProjectActivity } from './project-activity';

@JsonSchema.Resource({
	name: 'activity-successors',
	title: 'A blueprint of activity successors',
	description: 'This resource represents the successor connection between two activities.',
})
@Entity('activity_successors')
export class ActivitySuccessor extends CommonEntityFields {
	@JsonSchema.Property({
		type: 'string',
		format: 'uuid',
		pattern:
			'/^([A-Fa-f0-9]){8}-([A-Fa-f0-9]){4}-([A-Fa-f0-9]){4}-([A-Fa-f0-9]){4}-([A-Fa-f0-9]){12}$/',
		title: 'The unique identifier of a record',
		description:
			'This field is a generated universally unique identifier used to uniquely identify each record.',
	})
	id: string;

	@ManyToOne(() => ProjectActivity, (activity) => activity.id, { onDelete: 'CASCADE' })
	hostActivity: ProjectActivity;

	@ManyToOne(() => ProjectActivity, (activity) => activity.successors, { onDelete: 'CASCADE' })
	successorActivity: ProjectActivity;
}
