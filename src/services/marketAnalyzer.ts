import { detectSupportResistance } from "../core/structure/supportResistance.js";

import { analyzeRejection } from "../core/structure/rejectionAnalysis.js";

import { calculateTrendStrength } from "../core/structure/trendStrength.js";

import { calculateStructureScore } from "../core/structure/structureScore.js";

import { calculateConfluenceScore } from "../core/scoring/confluenceScore.js";

import { classifySignal } from "../core/scoring/signalClassification.js";
import { normalizeRSI } from "../core/scoring/normalization.js";
import { normalizeMACD } from "../core/indicators/macd.js";
import { normalizeATR } from "../core/indicators/atr.js";

import { detectBreakout } from "../core/structure/breakoutEngine.js";

import { detectFakeBreakout } from "../core/structure/fakeBreakoutDetector.js";

import { validateRetest } from "../core/structure/retestValidator.js";

import { calculateBreakoutScore } from "../core/scoring/breakoutScore.js";
import type { IndicatorResult } from "../types/market.js";

import { calculateMultiTimeframeScore } from "../core/scoring/multiTimeframeScore.js";

import { calculateFinalScore } from "../core/scoring/finalScore.js";
import type { MultiTimeframeResult } from "../core/scoring/multiTimeframeScore.js";
import { validateExecutionTrigger } from "../core/mtf/executionTrigger.js";
import { buildReasons } from "../core/scoring/reasonBuilder.js";
import { calculateVWAP } from "../core/indicators/vwap.js";
import { applyAdaptiveWeights } from "../core/scoring/adaptiveScoring.js";
import { applyAdaptiveConfidence } from "../core/scoring/adaptiveConfidence.js";
import type { MarketRegimeAnalysis } from "../types/marketRegime.js";
import { detectMarketRegime } from "../core/regime/marketRegimeEngine.js";

export async function analyzeMarket(
	symbol: string,
	candles: any[],
	latestCandle: any,
	indicators: any,
) {
	const srLevels = detectSupportResistance(candles);
	const vwapData = calculateVWAP(candles);

	// ======================
	// BREAKOUT ANALYSIS
	// ======================

	const breakout = detectBreakout(
		candles,
		srLevels,
		indicators.atr,
		indicators.macdHistogram,
		indicators.rsi,
	);

	const fakeBreakout = detectFakeBreakout(candles, srLevels);

	const retest = breakout.breakout
		? validateRetest(
				candles,
				breakout.breakoutLevel,
				breakout.direction as "BULLISH" | "BEARISH",
			)
		: {
				retestConfirmed: false,
				retestStrength: 0,
			};
	const breakoutScore = calculateBreakoutScore(breakout, fakeBreakout, retest);

	const rejection = analyzeRejection(latestCandle);

	const trendStrength = calculateTrendStrength(
		indicators.ema20,

		indicators.ema50,

		indicators.macdHistogram,

		indicators.atr,

		latestCandle.close,

		indicators.rsi,
	);
	const atrAverage = indicators.atr;

	const regime = detectMarketRegime(
		trendStrength.strength,
		indicators.atr,
		indicators.atr,
		latestCandle.close,
		indicators.sma20 ?? indicators.ema20,
	);
	const structureScore = calculateStructureScore(
		latestCandle.close,

		srLevels,

		trendStrength.trend,

		breakout.breakout,
	);

	const confluenceScore = calculateConfluenceScore({
		rsiScore: normalizeRSI(indicators.rsi),

		macdScore: normalizeMACD(indicators.macdHistogram),

		trendStrength:
			trendStrength.trend === "BULLISH"
				? trendStrength.strength
				: trendStrength.trend === "BEARISH"
					? -trendStrength.strength
					: 0,

		structureScore,

		patternScore: 50,

		rejectionScore: rejection.rejectionStrength,

		volatilityScore: normalizeATR(indicators.atr, latestCandle.close),

		breakoutScore: breakout.breakout ? breakout.breakoutStrength : 0,
		vwapPosition: vwapData.position,
		vwapStrength: vwapData.strength,
	});

	const mtfAnalysis: MultiTimeframeResult = {
		score: 50,
		bias: "NEUTRAL",
		confidence: 50,
		alignment: "MIXED",
	};
	const adjustedFinalScore = calculateFinalScore({
		baseScore: confluenceScore,

		mtfScore: mtfAnalysis.score,

		breakoutConfirmed: breakout.breakout,

		fakeBreakout: fakeBreakout.fakeBreakout,

		trendStrength: trendStrength.strength,
	});

	const executionTrigger = validateExecutionTrigger({
		htfBias: mtfAnalysis.bias,

		alignment: mtfAnalysis.alignment,

		breakout: breakout.breakout,

		breakoutDirection: breakout.direction,

		fakeBreakout: fakeBreakout.fakeBreakout,

		retestConfirmed: retest.retestConfirmed,

		momentumAligned: Math.abs(indicators.macdHistogram) > 5,

		confluenceScore: adjustedFinalScore,
	});

	// ======================
	// PRELIMINARY SIGNAL
	// ======================

	const preliminarySignal = executionTrigger.valid
		? classifySignal({
				score: adjustedFinalScore,

				mtfBias: mtfAnalysis.bias,

				alignment: mtfAnalysis.alignment,

				confidence: mtfAnalysis.confidence,

				breakout: breakout.breakout,

				trendStrength: trendStrength.strength,
			})
		: "NO TRADE";

	// ======================
	// APPLY ADAPTIVE WEIGHTS
	// ======================

	const adaptive = applyAdaptiveWeights(
		symbol,

		preliminarySignal,

		adjustedFinalScore,
	);

	const adaptiveFinalScore = adaptive.adjustedScore;

	const signal = executionTrigger.valid
		? classifySignal({
				score: adaptiveFinalScore,

				mtfBias: mtfAnalysis.bias,

				alignment: mtfAnalysis.alignment,

				confidence: mtfAnalysis.confidence,

				breakout: breakout.breakout,

				trendStrength: trendStrength.strength,
			})
		: "NO TRADE";

	// ======================
	// ADAPTIVE CONFIDENCE
	// ======================

	const adaptiveConfidence = applyAdaptiveConfidence(
		symbol,

		signal,

		mtfAnalysis.confidence,
	);

	const reasons = buildReasons({
		score: adjustedFinalScore,

		mtfBias: mtfAnalysis.bias,

		alignment: mtfAnalysis.alignment,

		breakout: breakout.breakout,

		fakeBreakout: fakeBreakout.fakeBreakout,

		retestConfirmed: retest.retestConfirmed,

		trend: trendStrength.trend,

		rsi: indicators.rsi,

		macdHistogram: indicators.macdHistogram,
	});
	console.log("REGIME DEBUG:", symbol, regime);

	return {
		signal,

		confidence: adaptiveConfidence.adjustedConfidence,

		adaptiveConfidence: adaptiveConfidence.adjustedConfidence,

		adaptiveSignalMultiplier: adaptive.signalMultiplier,

		adaptiveSymbolMultiplier: adaptive.symbolMultiplier,

		adaptiveConfidenceMultiplier: adaptiveConfidence.signalMultiplier,

		score: adaptiveFinalScore,

		confluenceScore,

		trendStrength,

		structure: srLevels,

		rejection,

		breakout,

		fakeBreakout,

		retest,

		breakoutScore,

		mtfAnalysis: {
			...mtfAnalysis,

			confidence: adaptiveConfidence.adjustedConfidence,
		},

		executionTrigger,

		reasons,

		VWAP: {
			value: Number(vwapData.vwap.toFixed(2)),

			distance: Number(vwapData.distanceFromVWAP.toFixed(2)),

			position: vwapData.position,

			strength: Number(vwapData.strength.toFixed(2)),
		},

		regime,
	};
}
