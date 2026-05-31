import fs from "fs";

import { getMarketData } from "../data/marketDataService.js";

async function fetchCandles() {
	const candles = await getMarketData("^NSEI", "1h", "6mo");

	fs.writeFileSync(
		"./src/backtest/sampleData.json",
		JSON.stringify(candles, null, 2),
	);

	console.error("Saved candles:", candles.length);
}

fetchCandles();
