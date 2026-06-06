import {
	OutcomeRepository,
	type OutcomeRecord,
} from "../storage/repositories/outcomeRepository.js";

export class OutcomePersistenceService {
	constructor(private readonly repository = new OutcomeRepository()) {}

	saveOutcome(outcome: OutcomeRecord): void {
		this.repository.upsertOutcome(outcome);
	}

	getOutcome(signalId: number): OutcomeRecord | null {
		return this.repository.getOutcome(signalId);
	}

	getAllOutcomes(): OutcomeRecord[] {
		return this.repository.getAllOutcomes();
	}
}
