import axios from "axios";

import { calculateRSI } from "./rsi.js";
import { calculateEMA } from "./ema.js";
import { calculateMACD } from "./macd.js";
import { calculateATR } from "./atr.js";
import { calculateSMA } from "./sma.js";

import type { Candle } from "./types.js";
import { scanPatterns } from "../patterns/patternScanner.js";
import { calculatePatternScore } from "../scoring/patternScore.js";

import { getMarketData } from "../../data/marketDataService.js";
import { detectVolumeExpansion } from "../volume/volumeExpansion.js";
import { calculateVWAP } from "./vwap.js";
import { calculateRVOL } from "../volume/relativeVolume.js";
import type {
	MarketInterval,
	MarketRange,
} from "../../types/marketDataProvider.js";
import { detectMarketRegime } from "../regime/marketRegimeEngine.js";
import { detectVolatilityRegime } from "../volatility/volatilityRegimeEngine.js";

export async function fetchCandles(
	symbol: string,
	interval: MarketInterval = "5m",
	range: MarketRange = "1d",
): Promise<Candle[]> {
	return getMarketData(symbol, interval, "1d");
}

function normalizeSymbol(symbol: string) {
	const upper = symbol.toUpperCase();

	const mapping: Record<string, string> = {
		NIFTY50: "^NSEI",
		NIFTY: "^NSEI",

		BANKNIFTY: "^NSEBANK",
		"BANK NIFTY": "^NSEBANK",

		SENSEX: "^BSESN",
	};

	return mapping[upper] || symbol;
}

export async function getStockPrice(symbol: string) {
	symbol = normalizeSymbol(symbol.trim());
	console.error("Normalized Symbol from getStockPrice():", symbol);
	const response = await axios.get(
		`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`,
	);

	const price = response.data.chart.result[0].meta.regularMarketPrice;

	return {
		symbol,
		price,
	};
}

export async function getCandleData(symbol: string, interval: string) {
	symbol = normalizeSymbol(symbol.trim());
	interval = interval.trim();
	console.error("Normalized Symbol from getCandleData():", symbol);
	const response = await axios.get(
		`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=1d`,
	);

	const result = response.data.chart.result[0];

	const timestamps = result.timestamp;

	const quote = result.indicators.quote[0];

	const candles = timestamps.map((time: number, index: number) => ({
		time: new Date(time * 1000).toLocaleString(),

		open: Number(quote.open[index]?.toFixed(2)),

		high: Number(quote.high[index]?.toFixed(2)),

		low: Number(quote.low[index]?.toFixed(2)),

		close: Number(quote.close[index]?.toFixed(2)),

		volume: quote.volume[index],
	}));

	return candles.slice(-5);
}

export async function analyzeTimeframe(symbol: string, interval: string) {
	symbol = normalizeSymbol(symbol.trim());
	console.error("Normalized Symbol from analyzeTimeframe():", symbol);
	const response = await axios.get(
		`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=1mo`,
	);

	const result = response.data.chart.result;

	if (!result || result.length === 0) {
		throw new Error("Invalid stock symbol");
	}

	const chartData = result[0];

	const quoteData = chartData.indicators.quote?.[0];

	if (!quoteData) {
		throw new Error("Quote data unavailable");
	}

	const closes = quoteData.close.filter(
		(price: number | null): price is number => price !== null,
	);

	const highs = quoteData.high.filter(
		(price: number | null): price is number => price !== null,
	);

	const lows = quoteData.low.filter(
		(price: number | null): price is number => price !== null,
	);
	const candles: Candle[] = closes.map(
		(close: number, index: number): Candle => ({
			open: quoteData.open[index] ?? close,

			high: highs[index] ?? close,

			low: lows[index] ?? close,

			close,

			volume: quoteData.volume[index] ?? 0,
		}),
	);

	const cleanVolumes = quoteData.volume.filter(
		(v: number | null): v is number => v !== null && v > 0,
	);

	const volumeData = calculateRVOL(cleanVolumes);
	const expansionData = detectVolumeExpansion(cleanVolumes);
	const vwapData = calculateVWAP(candles);

	const patterns = scanPatterns(candles);
	const patternScores = calculatePatternScore(patterns);

	const minimumCandles = interval === "1h" ? 30 : 50;

	if (closes.length < minimumCandles) {
		throw new Error(`Not enough candle data for ${interval}`);
	}

	const currentPrice = closes[closes.length - 1]!;

	const rsi = calculateRSI(closes);

	const sma20 = calculateSMA(closes, 20);

	const ema20 = calculateEMA(closes, 20);

	const ema50 = calculateEMA(closes, 50);

	const atr = calculateATR(highs, lows, closes, 14);

	const atrHistory: number[] = [];

	for (let i = 20; i < closes.length; i++) {
		const atrValue = calculateATR(
			highs.slice(0, i + 1),
			lows.slice(0, i + 1),
			closes.slice(0, i + 1),
			14,
		);

		if (!isNaN(atrValue) && atrValue > 0) {
			atrHistory.push(atrValue);
		}
	}

	const averageATR =
		atrHistory.length > 0
			? atrHistory.reduce((a, b) => a + b, 0) / atrHistory.length
			: atr;

	const atrPercent = currentPrice === 0 ? 0 : (atr / currentPrice) * 100;

	const volatility = detectVolatilityRegime(atr, averageATR);

	const macdResult = calculateMACD(closes) as any;
	const macd = macdResult?.MACD ?? 0;

	const macdSignal = macdResult?.signal ?? 0;

	const histogram = macdResult?.histogram ?? 0;

	let bullishScore = 0;
	let bearishScore = 0;

	const reasons: string[] = [];

	// Pattern scoring
	bullishScore += patternScores.bullishScore;

	bearishScore += patternScores.bearishScore;

	reasons.push(...patternScores.reasons);

	// RSI
	if (rsi < 30) {
		bullishScore += 20;
		reasons.push("RSI oversold");
	} else if (rsi > 70) {
		bearishScore += 20;
		reasons.push("RSI overbought");
	}

	// SMA
	if (currentPrice > sma20) {
		bullishScore += 20;
		reasons.push("Price above SMA20");
	} else {
		bearishScore += 20;
		reasons.push("Price below SMA20");
	}

	// ======================
	// VWAP CONTEXT
	// ======================

	if (vwapData.position === "ABOVE") {
		bullishScore += 15;

		reasons.push("Price above VWAP");
	} else {
		bearishScore += 15;

		reasons.push("Price below VWAP");
	}
	// ======================
	// RVOL PARTICIPATION
	// ======================

	if (volumeData.strength === "HIGH") {
		bullishScore += 10;

		reasons.push("High relative volume participation");
	}

	if (volumeData.strength === "EXTREME") {
		bullishScore += 20;

		reasons.push("Extreme institutional participation");
	}

	if (volumeData.strength === "LOW") {
		bearishScore += 10;

		reasons.push("Weak volume participation");
	}
	// ======================
	// VOLUME EXPANSION
	// ======================

	if (expansionData.strength === "STRONG") {
		bullishScore += 10;

		reasons.push("Strong volume expansion");
	}

	if (expansionData.strength === "EXTREME") {
		bullishScore += 20;

		reasons.push("Extreme momentum expansion");
	}

	if (expansionData.strength === "WEAK") {
		bearishScore += 10;

		reasons.push("Weak momentum expansion");
	}
	// EMA
	if (ema20 > ema50) {
		bullishScore += 30;
		reasons.push("EMA bullish trend");
	} else {
		bearishScore += 30;
		reasons.push("EMA bearish trend");
	}

	const macdHistory = (calculateMACD(closes, true) || []) as any[];

	const previousHistogram = macdHistory[macdHistory.length - 2]?.histogram || 0;

	const currentHistogram = macdHistory[macdHistory.length - 1]?.histogram || 0;

	// MACD
	if (macd > macdSignal) {
		bullishScore += 30;

		reasons.push("MACD bullish crossover");

		if (currentHistogram > previousHistogram) {
			bullishScore += 10;

			reasons.push("Bullish momentum increasing");
		} else {
			bearishScore += 10;

			reasons.push("Bullish momentum slowing");
		}
	} else {
		bearishScore += 30;

		reasons.push("MACD bearish crossover");

		if (currentHistogram < previousHistogram) {
			bearishScore += 10;

			reasons.push("Bearish momentum increasing");
		}
	}

	const finalScore = bullishScore - bearishScore;

	const trendStrength = Math.min(100, Math.abs(finalScore));

	const regime = detectMarketRegime(
		trendStrength,
		atr,
		averageATR,
		currentPrice,
		sma20,
	);

	console.log(symbol, interval, {
		finalScore,
		trendStrength,
		regime: regime.regime,
		volatility: volatility.volatilityRegime,
		atrRatio: volatility.atrRatio,
	});

	return {
		interval,

		currentPrice,

		RSI: Number(rsi.toFixed(2)),

		SMA20: Number(sma20.toFixed(2)),

		EMA20: Number(ema20.toFixed(2)),
		EMA50: Number(ema50.toFixed(2)),

		MACD: Number(macd.toFixed(2)),
		MACDSignal: Number(macdSignal.toFixed(2)),
		MACDHistogram: Number(histogram.toFixed(2)),
		ATR: Number(atr.toFixed(2)),

		bullishScore,
		bearishScore,

		finalScore,
		patterns,
		reasons,
		VWAP: {
			value: Number(vwapData.vwap.toFixed(2)),

			distance: Number(vwapData.distanceFromVWAP.toFixed(2)),

			position: vwapData.position,

			strength: Number(vwapData.strength.toFixed(2)),
		},
		RVOL: {
			currentVolume: volumeData.currentVolume,

			averageVolume: volumeData.averageVolume,

			rvol: volumeData.rvol,

			strength: volumeData.strength,
		},
		VolumeExpansion: {
			currentVolume: expansionData.currentVolume,

			previousVolume: expansionData.previousVolume,

			expansionRatio: expansionData.expansionRatio,

			expanding: expansionData.expanding,

			strength: expansionData.strength,
		},
		ATRPercent: Number(atrPercent.toFixed(2)),
		regime,
		volatility,
	};
}

export async function getRSIData(symbol: string, interval: string) {
	symbol = normalizeSymbol(symbol.trim());
	console.error("Normalized Symbol from getRSIData():", symbol);
	const response = await axios.get(
		`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=5d`,
	);

	const result = response.data.chart.result[0];

	const closes = result.indicators.quote[0].close.filter(
		(price: number | null) => price !== null,
	);

	const rsi = calculateRSI(closes);

	return {
		symbol,
		interval,
		RSI: Number(rsi.toFixed(2)),
	};
}

export async function getSMAData(
	symbol: string,
	interval: string,
	period: number,
) {
	symbol = normalizeSymbol(symbol.trim());
	interval = interval.trim();
	console.error("Normalized Symbol from getSMAData():", symbol);
	const response = await axios.get(
		`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=5d`,
	);

	const result = response.data.chart.result;

	if (!result || result.length === 0) {
		throw new Error("Invalid stock symbol");
	}

	const chartData = result[0];

	const closes = chartData.indicators.quote[0].close.filter(
		(price: number | null) => price !== null,
	);

	if (closes.length < period) {
		throw new Error("Not enough candle data");
	}

	const sma = calculateSMA(closes, period);

	const currentPrice = closes[closes.length - 1];

	const trend = currentPrice > sma ? "Bullish" : "Bearish";

	return {
		symbol,
		interval,
		period,

		currentPrice: Number(currentPrice.toFixed(2)),

		SMA: Number(sma.toFixed(2)),

		trend,
	};
}

export async function generateMultiIndicatorSignal(
	symbol: string,
	interval: string,
) {
	symbol = normalizeSymbol(symbol.trim());
	interval = interval.trim();

	try {
		const response = await axios.get(
			`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=5d`,
		);

		const result = response.data.chart.result;

		if (!result || result.length === 0) {
			throw new Error("Invalid stock symbol");
		}

		const chartData = result[0];

		const quoteData = chartData.indicators.quote?.[0];

		if (!quoteData) {
			throw new Error("Quote data unavailable");
		}

		const closes = quoteData.close.filter(
			(price: number | null): price is number => price !== null,
		);

		const highs = quoteData.high.filter(
			(price: number | null): price is number => price !== null,
		);

		const lows = quoteData.low.filter(
			(price: number | null): price is number => price !== null,
		);

		const candles: Candle[] = closes.map(
			(close: number, index: number): Candle => ({
				open: quoteData.open[index] ?? close,

				high: highs[index] ?? close,

				low: lows[index] ?? close,

				close,

				volume: quoteData.volume[index] ?? 0,
			}),
		);

		const patterns = scanPatterns(candles);

		const patternScores = calculatePatternScore(patterns);

		if (closes.length < 50) {
			throw new Error("Not enough candle data");
		}

		const currentPrice = closes[closes.length - 1]!;

		// RSI
		const rsi = calculateRSI(closes);

		// SMA
		const sma20 = calculateSMA(closes, 20);

		// EMA
		const ema20 = calculateEMA(closes, 20);
		const ema50 = calculateEMA(closes, 50);

		// ATR
		const atr = calculateATR(highs, lows, closes, 14);

		// MACD
		const macdResult = calculateMACD(closes) as any;
		const macd = macdResult?.MACD ?? 0;

		const macdSignal = macdResult?.signal ?? 0;

		const histogram = macdResult?.histogram ?? 0;

		const macdHistory = (calculateMACD(closes, true) || []) as any[];

		const previousHistogram =
			macdHistory[macdHistory.length - 2]?.histogram || 0;

		const currentHistogram =
			macdHistory[macdHistory.length - 1]?.histogram || 0;

		// Trends
		const smaTrend = currentPrice > sma20 ? "Bullish" : "Bearish";

		const emaTrend = ema20 > ema50 ? "Bullish" : "Bearish";

		// Weighted Scores
		let bullishScore = 0;
		let bearishScore = 0;

		const reasons: string[] = [];
		bullishScore += patternScores.bullishScore;

		bearishScore += patternScores.bearishScore;

		reasons.push(...patternScores.reasons);

		if (macd > macdSignal) {
			bullishScore += 30;

			reasons.push("MACD bullish crossover");

			if (currentHistogram > previousHistogram) {
				bullishScore += 10;

				reasons.push("Bullish momentum increasing");
			} else {
				bearishScore += 10;

				reasons.push("Bullish momentum slowing");
			}
		} else {
			bearishScore += 30;

			reasons.push("MACD bearish crossover");

			if (currentHistogram < previousHistogram) {
				bearishScore += 10;

				reasons.push("Bearish momentum increasing");
			}
		}
		// RSI
		if (rsi < 30) {
			bullishScore += 20;
			reasons.push("RSI oversold");
		} else if (rsi > 70) {
			bearishScore += 20;
			reasons.push("RSI overbought");
		}

		// SMA
		if (currentPrice > sma20) {
			bullishScore += 20;
			reasons.push("Price above SMA20");
		} else {
			bearishScore += 20;
			reasons.push("Price below SMA20");
		}

		// EMA
		if (ema20 > ema50) {
			bullishScore += 30;
			reasons.push("EMA bullish trend");
		} else {
			bearishScore += 30;
			reasons.push("EMA bearish trend");
		}

		// Final Score
		const finalScore = bullishScore - bearishScore;

		let signal = "HOLD";

		let stopLoss = 0;
		let target = 0;
		let riskReward = 0;

		if (finalScore >= 50) {
			signal = "BUY";

			stopLoss = currentPrice - atr * 1.5;

			target = currentPrice + atr * 3;
		} else if (finalScore <= -50) {
			signal = "SELL";

			stopLoss = currentPrice + atr * 1.5;

			target = currentPrice - atr * 3;
		}

		if (stopLoss !== 0) {
			const risk = Math.abs(currentPrice - stopLoss);

			const reward = Math.abs(target - currentPrice);

			riskReward = reward / risk;
		}

		const totalScore = bullishScore + bearishScore;

		const confidence =
			totalScore === 0 ? 0 : (Math.abs(finalScore) / totalScore) * 100;

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(
						{
							symbol,
							interval,

							currentPrice: Number(currentPrice.toFixed(2)),

							RSI: Number(rsi.toFixed(2)),

							SMA20: Number(sma20.toFixed(2)),

							EMA20: Number(ema20.toFixed(2)),
							EMA50: Number(ema50.toFixed(2)),

							MACD: Number(macd.toFixed(2)),
							MACDSignal: Number(macdSignal.toFixed(2)),

							smaTrend,
							emaTrend,

							bullishScore,
							bearishScore,

							finalScore,
							signal,
							patterns,
							ATR: Number(atr.toFixed(2)),
							stopLoss: Number(stopLoss.toFixed(2)),
							target: Number(target.toFixed(2)),
							riskReward: Number(riskReward.toFixed(2)),

							confidence,
							reasons,
						},
						null,
						2,
					),
				},
			],
		};
	} catch (error: any) {
		return {
			content: [
				{
					type: "text",
					text: `Error: ${error.message}`,
				},
			],
		};
	}
}

export async function generateRSISignal(symbol: string, interval: string) {
	symbol = normalizeSymbol(symbol.trim());
	interval = interval.trim();
	console.error("Normalized Symbol from generateRSISignal():", symbol);
	const response = await axios.get(
		`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=5d`,
	);

	const result = response.data.chart.result;

	if (!result || result.length === 0) {
		throw new Error("Invalid stock symbol");
	}

	const chartData = result[0];

	const closes = chartData.indicators.quote[0].close.filter(
		(price: number | null) => price !== null,
	);

	const rsi = calculateRSI(closes);

	let signal = "HOLD";

	let reason = "Market is neutral";

	if (rsi < 30) {
		signal = "BUY";

		reason = "RSI indicates oversold condition";
	} else if (rsi > 70) {
		signal = "SELL";

		reason = "RSI indicates overbought condition";
	}

	return {
		symbol,
		interval,

		RSI: Number(rsi.toFixed(2)),

		signal,
		reason,
	};
}
