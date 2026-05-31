import type { Candle } from "../core/indicators/types.js";

export function aggregateCandles(candles: Candle[], size: number): Candle[] {
	const aggregated: Candle[] = [];

	for (let i = 0; i < candles.length; i += size) {
		const chunk = candles.slice(i, i + size);

		if (chunk.length < size) {
			continue;
		}

		aggregated.push({
			open: chunk[0]!.open,

			high: Math.max(...chunk.map((c) => c.high)),

			low: Math.min(...chunk.map((c) => c.low)),

			close: chunk[chunk.length - 1]!.close,

			volume: chunk.reduce((sum, c) => sum + c.volume, 0),

			timestamp: chunk[chunk.length - 1]?.timestamp ?? "",
		});
	}

	return aggregated;
}
