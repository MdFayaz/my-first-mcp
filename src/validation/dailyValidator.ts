import { ScannerService } from "../services/scannerService.js";
import { SignalPersistenceService } from "../services/signalPersistenceService.js";
import { SignalMapper } from "../mappers/signalMapper.js";

export class DailyValidator {
	private readonly scanner = new ScannerService();
	private readonly persistence = new SignalPersistenceService();

	async processDate(date: string): Promise<void> {
		console.log(`Running validation for ${date}`);

		/**
		 * Phase 1:
		 * Run current scanner
		 *
		 * Future:
		 * Historical replay
		 */

		const results = await this.scanner.scan();
		const signalRecords = results.map((signal) =>
			SignalMapper.toSignalRecord(signal, date),
		);

		this.persistence.saveSignals(signalRecords);

		console.log(`Generated ${results.length} signals`);
	}
}
