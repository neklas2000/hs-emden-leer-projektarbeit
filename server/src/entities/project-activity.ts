import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CommonEntityFields } from './common-entity-fields';
import { Project } from './project';
import { ActivityPredecessor } from './activity-predecessor';
import { ActivitySuccessor } from './activity-successor';

@Entity('project_activities')
export class ProjectActivity extends CommonEntityFields {
	@Column({ type: 'varchar' })
	name: string;

	@Column({ type: 'decimal', scale: 2, precision: 6 })
	duration: number;

	@Column({ type: 'datetime', nullable: true })
	start: string;

	@Column({ type: 'datetime', nullable: true })
	end: string;

	@ManyToOne(() => Project, (project) => project.activities, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'project_id' })
	project: Project;

	@OneToMany(() => ActivityPredecessor, (predecessor) => predecessor.predecessorActivity)
	predecessors: ActivityPredecessor[];

	@OneToMany(() => ActivitySuccessor, (successor) => successor.successorActivity)
	successors: ActivitySuccessor[];
}
