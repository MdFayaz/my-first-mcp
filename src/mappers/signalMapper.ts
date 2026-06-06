import type { SignalRecord } from "../types/signalRecord.js";

export class SignalMapper {
	static toSignalRecord(signal: any, signalDate: string): SignalRecord {
		return {
			symbol: signal.symbol,

			signalDate,

			direction: signal.signal,

			score: signal.score ?? 0,

			confidence: signal.confidence ?? 0,

			entryPrice: signal.entryPrice ?? undefined,

			reasons: Array.isArray(signal.reasons)
				? signal.reasons.join("; ")
				: undefined,
		};
	}
}
