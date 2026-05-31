import type { Candle } from "../../indicators/types.js";

import { bodySize, upperWick, lowerWick, isBullish } from "../candleUtils.js";

export function isBullishMarubozu(candle: Candle): boolean {
	const body = bodySize(candle);

	const upper = upperWick(candle);

	const lower = lowerWick(candle);

	const range = candle.high - candle.low;

	return (
		isBullish(candle) &&
		body >= range * 0.8 &&
		upper <= range * 0.1 &&
		lower <= range * 0.1
	);
}
