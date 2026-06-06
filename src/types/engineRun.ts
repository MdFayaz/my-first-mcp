export enum RunStatus {
	RUNNING = "RUNNING",
	SUCCESS = "SUCCESS",
	FAILED = "FAILED",
}

export interface EngineRun {
	id?: number;

	runDate: string;

	status: RunStatus;

	startedAt: string;

	completedAt?: string;

	errorMessage?: string;
}
