interface MomentumData {
	rsi: number;
	macd: number;
	macdSignal: number;
}

export function momentumScore(data: MomentumData) {
	let score = 0;
	const reasons: string[] = [];

	// RSI

	if (data.rsi < 20) {
		score += 40;
		reasons.push("RSI extremely oversold");
	} else if (data.rsi < 30) {
		score += 25;
		reasons.push("RSI oversold");
	} else if (data.rsi > 80) {
		score -= 40;
		reasons.push("RSI extremely overbought");
	} else if (data.rsi > 70) {
		score -= 20;
		reasons.push("RSI overbought");
	} else if (data.rsi > 55) {
		score += 10;
		reasons.push("RSI bullish momentum");
	}

	// MACD

	if (data.macd > data.macdSignal) {
		score += 30;
		reasons.push("MACD bullish crossover");
	} else {
		score -= 30;
		reasons.push("MACD bearish crossover");
	}

	return {
		score,
		reasons,
	};
}
