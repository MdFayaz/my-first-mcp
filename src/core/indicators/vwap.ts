export interface VWAPResult {
	vwap: number;
	distanceFromVWAP: number;
	position: "ABOVE" | "BELOW";
	strength: number;
}

interface Candle {
	high: number;
	low: number;
	close: number;
	volume: number;
}

export function calculateVWAP(candles: Candle[]): VWAPResult {
	// ======================
	// EMPTY DATA PROTECTION
	// ======================

	if (candles.length === 0) {
		return {
			vwap: 0,
			distanceFromVWAP: 0,
			position: "BELOW",
			strength: 0,
		};
	}

	let cumulativeTPV = 0;

	let cumulativeVolume = 0;

	for (const candle of candles) {
		const typicalPrice = (candle.high + candle.low + candle.close) / 3;

		cumulativeTPV += typicalPrice * candle.volume;

		cumulativeVolume += candle.volume;
	}

	const latestClose = candles[candles.length - 1]!.close;

	const vwap =
		cumulativeVolume === 0 ? latestClose : cumulativeTPV / cumulativeVolume;

	const distanceFromVWAP = ((latestClose - vwap) / vwap) * 100;

	const position = latestClose >= vwap ? "ABOVE" : "BELOW";

	const strength = Math.min(Math.abs(distanceFromVWAP) * 5, 10);

	return {
		vwap,
		distanceFromVWAP,
		position,
		strength,
	};
}
