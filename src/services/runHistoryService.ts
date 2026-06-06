import { RunRepository } from "../storage/repositories/runRepository.js";

export class RunHistoryService {
	constructor(private readonly repository = new RunRepository()) {}

	startRun(runDate: string): number {
		return this.repository.createRun(runDate);
	}

	completeRun(runId: number): void {
		this.repository.markSuccess(runId);
	}

	failRun(runId: number, errorMessage: string): void {
		this.repository.markFailed(runId, errorMessage);
	}

	getLatestRun() {
		return this.repository.getLatestRun();
	}
}
