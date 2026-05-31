import type { Candle } from "../../indicators/types.js";

import { isBullish, isBearish } from "../candleUtils.js";

export function isBullishEngulfing(previous: Candle, current: Candle): boolean {
	return (
		isBearish(previous) &&
		isBullish(current) &&
		current.open < previous.close &&
		current.close > previous.open
	);
}
