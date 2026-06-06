import { SignalRepository } from "../storage/repositories/signalRepository.js";
import type { SignalRecord } from "../types/signalRecord.js";

export class SignalPersistenceService {
	constructor(private readonly repository = new SignalRepository()) {}

	saveSignals(signals: SignalRecord[]): void {
		for (const signal of signals) {
			this.repository.upsert(signal);
		}
	}
}
