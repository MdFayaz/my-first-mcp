import { symbols } from "./symbolLoader.js";

import { formatDecision } from "./decisionFormatter.js";

import { generateMultiTimeframeSignal } from "../core/strategy.js";
import { logSignals } from "../performance/signalLogger.js";

export async function scanMarket() {
	const results = [];

	for (const symbol of symbols) {
		console.log(`Scanning ${symbol}...`);

		try {
			const result = await generateMultiTimeframeSignal(symbol);

			const formatted = formatDecision(result);

			// const shouldInclude =
			// 	formatted.confidence >= 70 && Math.abs(formatted.score) >= 25;

			// if (shouldInclude) {
			// 	results.push(formatted);
			// }
			const atrQualified = (formatted.ATRPercent ?? 0) >= 0.15;

			(formatted as any).qualified =
				formatted.confidence >= 70 &&
				Math.abs(formatted.score) >= 25 &&
				atrQualified
					? "YES"
					: "NO";

			results.push(formatted);
		} catch (error) {
			console.error(`Failed: ${symbol}`, error);
		}
	}

	results.sort((a: any, b: any) => {
		const signalPriority: Record<string, number> = {
			"STRONG BUY": 5,
			BUY: 4,
			HOLD: 3,
			SELL: 2,
			"STRONG SELL": 1,
		};

		const signalDiff =
			(signalPriority[b.signal] ?? 0) - (signalPriority[a.signal] ?? 0);

		if (signalDiff !== 0) {
			return signalDiff;
		}

		return Math.abs(b.score) - Math.abs(a.score);
	});
	logSignals(results);

	return results;
}
