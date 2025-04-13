import { ActivityPredecessor } from './activity-predecessor';
import { ActivitySuccessor } from './activity-successor';
import { File } from './file';
import { MilestoneEstimate } from './milestone-estimate';
import { Project } from './project';
import { ProjectActivity } from './project-activity';
import { ProjectMember } from './project-member';
import { ProjectMilestone } from './project-milestone';
import { ProjectReportAppendix } from './project-report-appendix';
import { ProjectReport } from './project-report';
import { TokenPair } from './token-pair';
import { User } from './user';

const ENTITIES = [
	ActivityPredecessor,
	ActivitySuccessor,
	File,
	MilestoneEstimate,
	ProjectActivity,
	ProjectMember,
	ProjectMilestone,
	ProjectReportAppendix,
	ProjectReport,
	Project,
	TokenPair,
	User,
];

export { ENTITIES };
