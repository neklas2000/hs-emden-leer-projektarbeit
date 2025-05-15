import { Entity, JoinColumn, ManyToOne } from 'typeorm';

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
	@JsonSchema.Relationship({
		type: 'ProjectActivity',
		title: '',
		description: '',
	})
	@ManyToOne(() => ProjectActivity, (activity) => activity.id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'host_activity_id' })
	hostActivity: ProjectActivity;

	@JsonSchema.Relationship({
		type: 'ProjectActivity',
		title: '',
		description: '',
	})
	@ManyToOne(() => ProjectActivity, (activity) => activity.successors, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'successor_activity_id' })
	successorActivity: ProjectActivity;
}
