import type { Candle } from "../../indicators/types.js";

import { bodySize, lowerWick, upperWick } from "../candleUtils.js";

export function isHammer(candle: Candle): boolean {
	const body = bodySize(candle);

	const lower = lowerWick(candle);

	const upper = upperWick(candle);

	return lower > body * 2 && upper < body * 0.5;
}
