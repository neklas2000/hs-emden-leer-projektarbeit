import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { JsonSchema } from '@JsonSchema/lib';
import { CommonEntityFields } from './common-entity-fields';
import { ProjectActivity } from './project-activity';

@JsonSchema.Resource({
	name: 'activity-predecessors',
	title: 'A blueprint of activity predecessors',
	description: 'This resource represents a predecessor connection between two activities.',
})
@Entity('activity_predecessors')
export class ActivityPredecessor extends CommonEntityFields {
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
	@ManyToOne(() => ProjectActivity, (activity) => activity.predecessors, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'predecessor_activity_id' })
	predecessorActivity: ProjectActivity;
}
