import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "signalHistory");

const LOG_FILE = path.join(LOG_DIR, "signals.json");

export function logSignals(signals: any[]) {
	// ======================
	// CREATE DIRECTORY
	// ======================

	if (!fs.existsSync(LOG_DIR)) {
		fs.mkdirSync(LOG_DIR, { recursive: true });
	}

	// ======================
	// LOAD EXISTING
	// ======================

	let existing: any[] = [];

	if (fs.existsSync(LOG_FILE)) {
		try {
			const raw = fs.readFileSync(LOG_FILE, "utf-8");

			existing = JSON.parse(raw);
		} catch {
			existing = [];
		}
	}

	// ======================
	// FORMAT NEW SIGNALS
	// ======================

	const timestamp = new Date().toISOString();

	console.log("FIRST SIGNAL STRUCTURE:", JSON.stringify(signals[0], null, 2));

	const formatted = signals.map((s) => ({
		timestamp,

		symbol: s.symbol,

		signal: s.signal,

		// ======================
		// ENTRY PRICE
		// ======================

		entryPrice: s.VWAP,

		score: s.score,

		confidence: s.confidence,

		qualified: s.qualified,

		VWAP: s.VWAP,

		VWAPPosition: s.VWAPPosition,

		RVOL: s.RVOL,

		RVOLStrength: s.RVOLStrength,

		ExpansionRatio: s.ExpansionRatio,

		ExpansionStrength: s.ExpansionStrength,

		ATRPercent: s.ATRPercent,

		// ======================
		// REGIME INTELLIGENCE
		// ======================

		regime: s.regime,

		regimeConfidence: s.regimeConfidence,

		higherTimeframeRegime: s.higherTimeframeRegime,

		executionRegime: s.executionRegime,

		// ======================
		// VOLATILITY INTELLIGENCE
		// ======================

		volatilityRegime: s.volatilityRegime,

		volatilityConfidence: s.volatilityConfidence,

		volatilityATRRatio: s.volatilityATRRatio,

		executionVolatilityRegime: s.executionVolatilityRegime,

		executionVolatilityConfidence: s.executionVolatilityConfidence,

		// ======================
		// ENVIRONMENT INTELLIGENCE
		// ======================

		environment: s.environment,

		environmentReason: s.environmentReason,

		environmentScoreMultiplier: s.environmentScoreMultiplier,

		environmentConfidenceMultiplier: s.environmentConfidenceMultiplier,

		reasons: s.reasons,
	}));

	// ======================
	// SAVE
	// ======================

	const combined = [...existing, ...formatted];
	console.log("LOG_FILE PATH:", LOG_FILE);
	fs.writeFileSync(LOG_FILE, JSON.stringify(combined, null, 2));

	console.log(`Logged ${formatted.length} signals`);
}
