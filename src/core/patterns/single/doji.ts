import type { Candle } from "../../indicators/types.js";

import { bodySize } from "../candleUtils.js";

export function isDoji(candle: Candle): boolean {
	const body = bodySize(candle);

	const range = candle.high - candle.low;

	return body <= range * 0.1;
}
