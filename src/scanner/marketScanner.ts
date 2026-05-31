import { symbols } from "./symbolLoader.js";

import { formatDecision } from "./decisionFormatter.js";

import { generateMultiTimeframeSignal } from "../core/strategy.js";
import { logSignals } from "../performance/signalLogger.js";
import { loadQualificationFeedback } from "../performance/loadQualificationFeedback.js";

export async function scanMarket() {
	const qualificationRules = loadQualificationFeedback();

	const results: any[] = [];

	for (const symbol of symbols) {
		console.log(`Scanning ${symbol}...`);

		try {
			const result = await generateMultiTimeframeSignal(symbol);

			const formatted = formatDecision(result);

			const environment = formatted.environment ?? "";

			const rule = qualificationRules[environment] ?? {
				minConfidence: 70,
				minScore: 25,
			};

			const atrQualified = (formatted.ATRPercent ?? 0) >= 0.15;

			(formatted as any).qualificationMinConfidence = rule.minConfidence;

			(formatted as any).qualificationMinScore = rule.minScore;

			(formatted as any).qualified =
				formatted.confidence >= rule.minConfidence &&
				Math.abs(formatted.finalEnvironmentScore ?? formatted.score) >=
					rule.minScore &&
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

		return (
			Math.abs(b.finalEnvironmentScore ?? b.score) -
			Math.abs(a.finalEnvironmentScore ?? a.score)
		);
	});
	logSignals(results);

	return results;
}
