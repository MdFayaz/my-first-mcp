import { analyzeTimeframe } from "./indicators/marketData.js";
import { momentumScore } from "./scoring/momentumScore.js";

import { trendScore } from "./scoring/trendScore.js";
import { prioritizeReasons } from "./scoring/reasonPriority.js";
import { applyAdaptiveWeights } from "./scoring/adaptiveScoring.js";
import { applyAdaptiveConfidence } from "./scoring/adaptiveConfidence.js";
import { applyRegimeScoring } from "./scoring/regimeScoring.js";
import { getEnvironmentWeighting } from "./scoring/environmentWeighting.js";
import { loadReliabilityFeedback } from "../performance/loadReliabilityFeedback.js";

interface MarketIndicators {
	rsi: number;
	currentPrice: number;
	sma20: number;
	ema20: number;
	ema50: number;

	macd: number;
	macdSignal: number;
}

export async function generateMultiTimeframeSignal(symbol: string) {
	const tf5m = await analyzeTimeframe(symbol, "5m");

	const tf15m = await analyzeTimeframe(symbol, "15m");

	const tf1h = await analyzeTimeframe(symbol, "1h");

	const combinedScore =
		tf5m.finalScore * 0.2 + tf15m.finalScore * 0.3 + tf1h.finalScore * 0.5;

	const regimeScoring = applyRegimeScoring(tf1h.regime?.regime ?? "CHOPPY");
	const environment = getEnvironmentWeighting(
		tf1h.regime?.regime ?? "CHOPPY",
		tf1h.volatility?.volatilityRegime ?? "NORMAL_VOLATILITY",
	);
	const environmentAdjustedScore = Number(
		(combinedScore * environment.scoreMultiplier).toFixed(2),
	);

	const reliability = loadReliabilityFeedback();

	const reliabilityRegimeMultiplier =
		reliability.regimeMultipliers[tf1h.regime?.regime ?? ""] ?? 1;

	const reliabilityVolatilityMultiplier =
		reliability.volatilityMultipliers[
			tf1h.volatility?.volatilityRegime ?? ""
		] ?? 1;

	const reliabilityEnvironmentMultiplier =
		reliability.environmentMultipliers[environment.environment] ?? 1;

	let signal = "HOLD";

	const reliabilityMultiplier = Number(
		Math.min(
			1.5,
			reliabilityRegimeMultiplier *
				reliabilityVolatilityMultiplier *
				reliabilityEnvironmentMultiplier,
		).toFixed(2),
	);
	// ======================
	// APPLY ADAPTIVE WEIGHTS
	// ======================

	const finalEnvironmentScore = Number(
		(environmentAdjustedScore * reliabilityMultiplier).toFixed(2),
	);

	if (finalEnvironmentScore >= 50) {
		signal = "STRONG BUY";
	} else if (finalEnvironmentScore >= 20) {
		signal = "BUY";
	} else if (finalEnvironmentScore <= -50) {
		signal = "STRONG SELL";
	} else if (finalEnvironmentScore <= -20) {
		signal = "SELL";
	}

	const timeframeScores = [tf5m.finalScore, tf15m.finalScore, tf1h.finalScore];

	const bullishAligned = timeframeScores.filter((s) => s > 0).length;

	const bearishAligned = timeframeScores.filter((s) => s < 0).length;

	const strongestAlignment = Math.max(bullishAligned, bearishAligned);

	const baseConfidence = (strongestAlignment / 3) * 100;

	const confidence = Math.max(
		0,
		Math.min(
			100,
			(baseConfidence + regimeScoring.confidenceAdjustment) *
				environment.confidenceMultiplier,
		),
	);

	const adaptive = applyAdaptiveWeights(symbol, signal, finalEnvironmentScore);

	// ======================
	// APPLY ADAPTIVE CONFIDENCE
	// ======================

	const adaptiveConfidence = applyAdaptiveConfidence(
		symbol,

		signal,

		confidence,
	);
	const reliabilityAdjustedConfidence = Math.min(
		100,
		adaptiveConfidence.adjustedConfidence * reliabilityMultiplier,
	);

	const reasons = [
		...tf5m.reasons.map((reason: string) => `5m: ${reason}`),

		...tf15m.reasons.map((reason: string) => `15m: ${reason}`),

		...tf1h.reasons.map((reason: string) => `1h: ${reason}`),
	];

	const prioritizedReasons = prioritizeReasons(reasons);

	return {
		symbol,

		signal,

		combinedScore: Number(adaptive.adjustedScore.toFixed(2)),

		regimeAdjustment: regimeScoring.confidenceAdjustment,

		regimeReason: regimeScoring.regimeReason,

		environment: environment.environment,

		environmentReason: environment.reason,

		environmentScoreMultiplier: environment.scoreMultiplier,

		environmentConfidenceMultiplier: environment.confidenceMultiplier,
		rawEnvironmentScore: environmentAdjustedScore,

		finalEnvironmentScore,

		reliabilityMultiplier,

		reliabilityRegimeMultiplier,

		reliabilityVolatilityMultiplier,

		reliabilityEnvironmentMultiplier,

		confidence: Number(reliabilityAdjustedConfidence.toFixed(2)),

		adaptiveConfidence: adaptiveConfidence.adjustedConfidence,

		adaptiveSignalMultiplier: adaptive.signalMultiplier,

		adaptiveSymbolMultiplier: adaptive.symbolMultiplier,

		adaptiveConfidenceMultiplier: adaptiveConfidence.signalMultiplier,

		timeframeAnalysis: {
			"5m": tf5m,

			"15m": tf15m,

			"1h": tf1h,
		},

		// ======================
		// EXECUTION VWAP
		// ======================

		VWAP: tf5m.VWAP,
		entryPrice: tf5m.currentPrice,
		reasons: prioritizedReasons,
		RVOL: tf5m.RVOL,
		VolumeExpansion: tf5m.VolumeExpansion,
		ATRPercent: tf5m.ATRPercent,
		regime: tf1h.regime,
		higherTimeframeRegime: tf1h.regime,
		executionRegime: tf5m.regime,
		volatility: tf1h.volatility,
		executionVolatility: tf5m.volatility,
		baseConfidence: adaptiveConfidence.adjustedConfidence,

		reliabilityAdjustedConfidence: Number(
			reliabilityAdjustedConfidence.toFixed(2),
		),
	};
}

export function generateSignal(data: MarketIndicators) {
	const momentum = momentumScore({
		rsi: data.rsi,
		macd: data.macd,
		macdSignal: data.macdSignal,
	});

	const trend = trendScore({
		currentPrice: data.currentPrice,
		sma20: data.sma20,
		ema20: data.ema20,
		ema50: data.ema50,
	});

	const totalScore = momentum.score + trend.score;

	const reasons = [...momentum.reasons, ...trend.reasons];

	let signal = "HOLD";

	if (totalScore >= 60) signal = "STRONG BUY";
	else if (totalScore >= 25) signal = "BUY";
	else if (totalScore <= -60) signal = "STRONG SELL";
	else if (totalScore <= -25) signal = "SELL";

	return {
		bullishScore: totalScore > 0 ? totalScore : 0,

		bearishScore: totalScore < 0 ? Math.abs(totalScore) : 0,

		finalScore: totalScore,

		signal,

		reasons,
	};
}
