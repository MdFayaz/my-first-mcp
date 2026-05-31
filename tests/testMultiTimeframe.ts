import { calculateMultiTimeframeScore } from "../src/core/scoring/multiTimeframeScore.js";

const result = calculateMultiTimeframeScore([
	{
		timeframe: "5m",
		signal: "BUY",
		confluenceScore: 52,
	},

	{
		timeframe: "15m",
		signal: "BUY",
		confluenceScore: 61,
	},

	{
		timeframe: "1h",
		signal: "BUY",
		confluenceScore: 74,
	},

	{
		timeframe: "4h",
		signal: "NEUTRAL",
		confluenceScore: 55,
	},
]);

console.log(JSON.stringify(result, null, 2));
