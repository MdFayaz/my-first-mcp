import { StateRepository } from "../storage/repositories/stateRepository.js";

export class ProcessingStateService {
	constructor(private readonly repository = new StateRepository()) {}

	getLastProcessedDate(): string | null {
		return this.repository.getLastProcessedDate();
	}

	setLastProcessedDate(date: string): void {
		this.repository.setLastProcessedDate(date);
	}
}
