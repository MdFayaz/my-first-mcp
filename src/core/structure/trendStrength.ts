export interface TrendStrengthResult {
	trend: "BULLISH" | "BEARISH" | "SIDEWAYS";
	strength: number;
}

export function calculateTrendStrength(
	ema20: number,
	ema50: number,
	macdHistogram: number,
	atr: number,
	price: number,

	rsi: number,
): TrendStrengthResult {
	let strength = 0;

	// EMA spread %
	const emaSpread = (Math.abs(ema20 - ema50) / price) * 100;

	// Controlled scoring
	strength += emaSpread * 15;

	// MACD contribution
	strength += Math.abs(macdHistogram) * 8;

	// ATR contribution
	strength += (atr / price) * 100 * 5;

	// Clamp
	strength = Math.min(Number(strength.toFixed(2)), 100);

	// Neutral threshold
	const trendThreshold = 0.3;

	let trend: TrendStrengthResult["trend"] = "SIDEWAYS";
	if (emaSpread >= trendThreshold) {
		if (ema20 > ema50) {
			trend = "BULLISH";
		}

		if (ema20 < ema50) {
			trend = "BEARISH";
		}
	}

	// ======================
	// MOMENTUM OVERRIDE
	// ======================

	// Bullish recovery
	if (macdHistogram > 0 && rsi > 55 && ema20 < ema50 && emaSpread < 1) {
		trend = "BULLISH";

		strength += 8;
	}

	// Bearish reversal
	if (macdHistogram < 0 && rsi < 45 && ema20 > ema50 && emaSpread < 1) {
		trend = "BEARISH";

		strength += 8;
	}

	// ======================
	// STRONG MOMENTUM BOOST
	// ======================

	if (macdHistogram > 8 && rsi > 60) {
		strength += 10;
	}

	if (macdHistogram < -8 && rsi < 40) {
		strength += 10;
	}

	// Final clamp
	strength = Math.min(Number(strength.toFixed(2)), 100);

	return {
		trend,
		strength,
	};
}
