import { SignalOutcomeRepository } from "./storage/repositories/signalOutcomeRepository.js";

const repo = new SignalOutcomeRepository();

repo.upsert({
	signalId: 999,

	symbol: "TEST.NS",

	signalDate: "2026-06-04",

	signal: "BUY",

	confidence: 85,

	qualified: "YES",

	regime: "TREND",

	environment: "TREND_NORMAL_VOLATILITY",

	volatilityRegime: "NORMAL_VOLATILITY",

	status: "WIN",

	pnlPercent: 5.8,

	holdingDays: 5,

	maxDrawdown: -1.3,

	evaluatedAt: new Date().toISOString(),
});

console.log(repo.getAll());
