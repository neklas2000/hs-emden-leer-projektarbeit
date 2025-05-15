enum ProjectRole {
	Contributor = 'contributor',
	Tutor = 'tutor',
}

enum AppLanguage {
	GERMAN = 'de',
	ENGLISH = 'en',
}

enum ColorMode {
	LIGHT = 'LIGHT',
	DARK = 'DARK',
}

enum PrimaryActionPosition {
	BOTTOM_RIGHT = 'bottom-right',
	TOOLBAR_BOTTOM_RIGHT = 'toolbar-bottom-right',
}

enum SnackbarPosition {
	TOP_LEFT = 'top-left',
	TOP_CENTER = 'top-center',
	TOP_RIGHT = 'top-right',
	BOTTOM_LEFT = 'bottom-left',
	BOTTOM_CENTER = 'bottom-center',
	BOTTOM_RIGHT = 'bottom-right',
}

namespace Entities {
  export type CommonEntityFields = {
    id: UUID;
    createdAt: Date;
    updatedAt: Date;
  };
  export type ProjectActivity = CommonEntityFields & {
    name: string;
    duration: number;
    start: Date | null;
    end: Date | null;
    project: Project;
    predecessors: ActivityPredecessor[];
    successors: ActivitySuccessor[];
  };
  export type ActivityPredecessor = CommonEntityFields & {
    hostActivity: ProjectActivity;
    predecessorActivity: ProjectActivity;
  };
  export type ActivitySuccessor = CommonEntityFields & {
    hostActivity: ProjectActivity;
    successorActivity: ProjectActivity;
  };
  export type AppSettings = CommonEntityFields & {
    language: AppLanguage;
    colorMode: ColorMode;
    dateFormat: string;
    timeFormat: string;
    primaryActionPosition: PrimaryActionPosition;
    snackbarPosition: SnackbarPosition;
    projectInvitation: boolean;
    projectChanges: boolean;
    newProjectReport: boolean;
    newProjectReportAttachPdf: boolean;
    latestProjectReportChanges: boolean;
    latestProjectReportChangesAttachPdf: boolean;
  };
  export type File = CommonEntityFields & {
	  name: string;
    mimeType: string;
    uri: string;
    uploadedBy: User;
    reportAppendices: ProjectReportAppendix[];
  };
  export type MilestoneEstimate = CommonEntityFields & {
    reportDate: Date;
    estimatedDate: Date;
    milestone: ProjectMilestone;
  };
  export type ProjectMember = CommonEntityFields & {
    role: ProjectRole;
    invitePending: boolean;
    user: User;
    project: Project;
  };
  export type ProjectMilestone = CommonEntityFields & {
    name: string;
    isReached: boolean;
    project: Project;
    estimates: MilestoneEstimate[];
  };
  export type ProjectReportAppendix = CommonEntityFields & {
    file: File;
    report: ProjectReport;
  };
  export type ProjectReport = CommonEntityFields & {
    sequenceNumber: number;
    reportDate: Date;
    deliverables: string;
    hazards: string;
    objectives: string;
    other: string | null;
    project: Project;
    appendices: ProjectReportAppendix[];
  };
  export type Project = CommonEntityFields & {
    name: string;
    officialStart: Date;
    officialEnd: Date | null;
    reportInterval: number;
    type: string | null;
    owner: User;
    members: ProjectMember[];
    reports: ProjectReport[];
    milestones: ProjectMilestone[];
    activities: ProjectActivity[];
  };
  export type TokenPair = CommonEntityFields & {
    accessToken: string | null;
    accessTokenExpirationDate: Date | null;
    refreshToken: string | null;
    refreshTokenExpirationDate: Date | null;
    user: User;
  };
  export type User = CommonEntityFields & {
    academicTitle: string | null;
    matriculationNumber: number | null;
    firstName: string | null;
    lastName: string | null;
    emailAddress: string;
    emailVerified: boolean;
    password: string;
    phoneNumber: string | null;
    projects: Project[];
    tokenPair: TokenPair;
    appSettings: AppSettings;
    files: File[];
  };
}

namespace ResponseTypes {
  export type Login = Pick<Entities.TokenPair, 'accessToken' | 'refreshToken'> & {
    user: Omit<Entities.User, 'password' | 'projects' | 'tokenPair' | 'appSettings' | 'files'>;
  };
  export type RefreshTokens = Login;
}
