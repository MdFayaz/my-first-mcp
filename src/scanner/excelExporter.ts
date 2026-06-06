import ExcelJS from "exceljs";

import fs from "fs";

import path from "path";

// ======================
// FILE PATHS
// ======================

const OUTCOMES_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"outcomes.json",
);

const PERFORMANCE_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"performance.json",
);

const GRADES_PATH = path.join(process.cwd(), "signalHistory", "grades.json");

const RELIABILITY_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"reliability.json",
);

const ADAPTIVE_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"adaptiveWeights.json",
);

const ENVIRONMENT_ANALYTICS_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"environmentAnalytics.json",
);

const REGIME_ANALYTICS_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"regimeAnalytics.json",
);

const VOLATILITY_ANALYTICS_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"volatilityAnalytics.json",
);

const CONFIDENCE_CALIBRATION_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"confidenceCalibration.json",
);

const POSITION_SIZING_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"positionSizing.json",
);

const RISK_REWARD_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"riskRewardOptimization.json",
);

const HOLDING_PERIOD_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"holdingPeriodAnalytics.json",
);

const EXIT_SUMMARY_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"exitAnalyticsSummary.json",
);
// ======================
// EXPORT FUNCTION
// ======================

export async function exportScannerResults(results: any[]) {
	const workbook = new ExcelJS.Workbook();

	// =====================================================
	// SHEET 1 — SCANNER RESULTS
	// =====================================================

	const sheet = workbook.addWorksheet("Scanner Results");

	sheet.columns = [
		{
			header: "Symbol",
			key: "symbol",
			width: 18,
		},

		{
			header: "Signal",
			key: "signal",
			width: 18,
		},

		{
			header: "Confidence",
			key: "confidence",
			width: 14,
		},
		{
			header: "Base Conf",
			key: "baseConfidence",
			width: 14,
		},

		{
			header: "Learned Conf",
			key: "reliabilityAdjustedConfidence",
			width: 14,
		},
		{
			header: "Adaptive Confidence",
			key: "adaptiveConfidence",
			width: 18,
		},

		{
			header: "Signal Multiplier",
			key: "adaptiveSignalMultiplier",
			width: 18,
		},

		{
			header: "Symbol Multiplier",
			key: "adaptiveSymbolMultiplier",
			width: 18,
		},

		{
			header: "Confidence Multiplier",
			key: "adaptiveConfidenceMultiplier",
			width: 22,
		},

		{
			header: "Score",
			key: "score",
			width: 12,
		},

		{
			header: "Raw Score",
			key: "rawEnvironmentScore",
			width: 14,
		},

		{
			header: "Reliability",
			key: "reliabilityMultiplier",
			width: 14,
		},

		{
			header: "Final Score",
			key: "finalEnvironmentScore",
			width: 14,
		},

		{
			header: "VWAP",
			key: "VWAP",
			width: 12,
		},

		{
			header: "VWAP Position",
			key: "VWAPPosition",
			width: 16,
		},

		{
			header: "VWAP Distance",
			key: "VWAPDistance",
			width: 16,
		},

		{
			header: "RVOL",
			key: "RVOL",
			width: 10,
		},

		{
			header: "RVOL Strength",
			key: "RVOLStrength",
			width: 16,
		},

		{
			header: "Expansion Ratio",
			key: "ExpansionRatio",
			width: 18,
		},

		{
			header: "Expansion Strength",
			key: "ExpansionStrength",
			width: 18,
		},

		{
			header: "Volume Expanding",
			key: "VolumeExpanding",
			width: 18,
		},

		{
			header: "ATR %",
			key: "ATRPercent",
			width: 12,
		},
		{
			header: "Environment",
			key: "environment",
			width: 28,
		},

		{
			header: "Environment Reason",
			key: "environmentReason",
			width: 35,
		},

		{
			header: "Rel Regime",
			key: "reliabilityRegimeMultiplier",
			width: 14,
		},

		{
			header: "Rel Vol",
			key: "reliabilityVolatilityMultiplier",
			width: 14,
		},

		{
			header: "Rel Env",
			key: "reliabilityEnvironmentMultiplier",
			width: 14,
		},
		{
			header: "Regime",
			key: "regime",
			width: 18,
		},

		{
			header: "Regime Confidence",
			key: "regimeConfidence",
			width: 18,
		},

		{
			header: "Volatility Regime",
			key: "volatilityRegime",
			width: 22,
		},

		{
			header: "Volatility Confidence",
			key: "volatilityConfidence",
			width: 20,
		},

		{
			header: "ATR Ratio",
			key: "volatilityATRRatio",
			width: 15,
		},
		{
			header: "Min Conf",
			key: "qualificationMinConfidence",
			width: 12,
		},

		{
			header: "Min Score",
			key: "qualificationMinScore",
			width: 12,
		},
		{
			header: "Execution Volatility",
			key: "executionVolatilityRegime",
			width: 24,
		},

		{
			header: "Exec Vol Confidence",
			key: "executionVolatilityConfidence",
			width: 20,
		},
		{
			header: "Higher TF Regime",
			key: "higherTimeframeRegime",
			width: 20,
		},

		{
			header: "Execution Regime",
			key: "executionRegime",
			width: 20,
		},

		{
			header: "Qualified",
			key: "qualified",
			width: 12,
		},

		{
			header: "Reasons",
			key: "reasons",
			width: 80,
		},
	];

	// ======================
	// FILTERS
	// ======================

	sheet.autoFilter = {
		from: "A1",
		to: `${sheet.getColumn(sheet.columnCount).letter}1`,
	};
	// ======================
	// FREEZE HEADER
	// ======================

	sheet.views = [
		{
			state: "frozen",
			ySplit: 1,
		},
	];

	// ======================
	// HEADER STYLE
	// ======================

	sheet.getRow(1).font = {
		bold: true,
		color: { argb: "FFFFFF" },
	};

	sheet.getRow(1).fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: {
			argb: "1F4E78",
		},
	};

	// ======================
	// ROWS
	// ======================

	[...results].reverse().forEach((r) => {
		const row = sheet.addRow({
			...r,

			reasons: Array.isArray(r.reasons) ? r.reasons.join(" | ") : r.reasons,
		});

		let fillColor = "FFFFFF";

		if (r.signal === "STRONG BUY") {
			fillColor = "C6EFCE";
		} else if (r.signal === "BUY") {
			fillColor = "E2F0D9";
		} else if (r.signal === "STRONG SELL") {
			fillColor = "F4CCCC";
		} else if (r.signal === "SELL") {
			fillColor = "FCE5CD";
		} else if (r.signal === "HOLD") {
			fillColor = "FFF2CC";
		}

		row.eachCell((cell) => {
			if (cell.value === r.regime) {
				if (r.regime === "STRONG_TREND") {
					cell.font = {
						bold: true,
						color: { argb: "006100" },
					};
				} else if (r.regime === "TREND") {
					cell.font = {
						bold: true,
						color: { argb: "1F4E78" },
					};
				} else if (r.regime === "RANGE") {
					cell.font = {
						bold: true,
						color: { argb: "7F6000" },
					};
				} else if (r.regime === "CHOPPY") {
					cell.font = {
						bold: true,
						color: { argb: "9C0006" },
					};
				}
			}
			cell.fill = {
				type: "pattern",

				pattern: "solid",

				fgColor: {
					argb: fillColor,
				},
			};
		});

		const reliabilityColumn = sheet.getColumn("reliabilityMultiplier").number;

		const reliabilityCell = row.getCell(reliabilityColumn);

		const reliabilityMultiplier = Number(reliabilityCell.value ?? 1);

		if (reliabilityMultiplier >= 1.15) {
			reliabilityCell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: {
					argb: "C6EFCE",
				},
			};
		}

		if (reliabilityMultiplier <= 0.9) {
			reliabilityCell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: {
					argb: "F4CCCC",
				},
			};
		}
	});

	// =====================================================
	// LOAD OUTCOMES
	// =====================================================

	let outcomes: any[] = [];

	if (fs.existsSync(OUTCOMES_PATH)) {
		try {
			const raw = fs.readFileSync(OUTCOMES_PATH, "utf-8");

			outcomes = JSON.parse(raw);
		} catch {
			outcomes = [];
		}
	}

	// =====================================================
	// SHEET 2 — OUTCOMES
	// =====================================================

	const outcomesSheet = workbook.addWorksheet("Outcomes");

	outcomesSheet.columns = [
		{
			header: "Symbol",
			key: "symbol",
			width: 18,
		},

		{
			header: "Signal",
			key: "signal",
			width: 18,
		},

		{
			header: "Entry Price",
			key: "entryPrice",
			width: 15,
		},

		{
			header: "Current Price",
			key: "currentPrice",
			width: 15,
		},

		{
			header: "PnL %",
			key: "pnlPercent",
			width: 12,
		},

		{
			header: "Status",
			key: "status",
			width: 12,
		},

		{
			header: "Score",
			key: "score",
			width: 10,
		},

		{
			header: "Confidence",
			key: "confidence",
			width: 12,
		},

		{
			header: "Qualified",
			key: "qualified",
			width: 12,
		},

		{
			header: "Timestamp",
			key: "timestamp",
			width: 28,
		},
	];

	outcomesSheet.autoFilter = {
		from: "A1",
		to: "J1",
	};

	outcomesSheet.views = [
		{
			state: "frozen",
			ySplit: 1,
		},
	];

	outcomesSheet.getRow(1).font = {
		bold: true,
		color: {
			argb: "FFFFFF",
		},
	};

	outcomesSheet.getRow(1).fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: {
			argb: "1F4E78",
		},
	};

	[...outcomes].reverse().forEach((o) => {
		const row = outcomesSheet.addRow(o);

		let fillColor = "FFFFFF";

		if (o.status === "WIN") {
			fillColor = "E2F0D9";
		} else if (o.status === "LOSS") {
			fillColor = "F4CCCC";
		} else if (o.status === "OPEN") {
			fillColor = "FFF2CC";
		}

		row.eachCell((cell) => {
			cell.fill = {
				type: "pattern",

				pattern: "solid",

				fgColor: {
					argb: fillColor,
				},
			};
		});
	});

	// =====================================================
	// LOAD PERFORMANCE
	// =====================================================

	let performance: any[] = [];

	if (fs.existsSync(PERFORMANCE_PATH)) {
		try {
			const raw = fs.readFileSync(PERFORMANCE_PATH, "utf-8");

			performance = JSON.parse(raw);
		} catch {
			performance = [];
		}
	}

	// =====================================================
	// SHEET 3 — PERFORMANCE
	// =====================================================

	const performanceSheet = workbook.addWorksheet("Performance");

	performanceSheet.columns = [
		{
			header: "Timestamp",
			key: "timestamp",
			width: 28,
		},

		{
			header: "Total Signals",
			key: "totalSignals",
			width: 15,
		},

		{
			header: "Wins",
			key: "wins",
			width: 10,
		},

		{
			header: "Losses",
			key: "losses",
			width: 10,
		},

		{
			header: "Open",
			key: "open",
			width: 10,
		},

		{
			header: "Win Rate",
			key: "winRate",
			width: 14,
		},

		{
			header: "Average PnL",
			key: "averagePnL",
			width: 16,
		},

		{
			header: "BUY Accuracy",
			key: "buyAccuracy",
			width: 16,
		},

		{
			header: "SELL Accuracy",
			key: "sellAccuracy",
			width: 16,
		},

		{
			header: "Qualified Accuracy",
			key: "qualifiedAccuracy",
			width: 20,
		},
	];

	performanceSheet.autoFilter = {
		from: "A1",
		to: "J1",
	};

	performanceSheet.views = [
		{
			state: "frozen",
			ySplit: 1,
		},
	];

	performanceSheet.getRow(1).font = {
		bold: true,
		color: {
			argb: "FFFFFF",
		},
	};

	performanceSheet.getRow(1).fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: {
			argb: "1F4E78",
		},
	};

	[...performance].reverse().forEach((p) => {
		performanceSheet.addRow(p);
	});

	// =====================================================
	// LOAD GRADES
	// =====================================================

	let grades: any[] = [];

	if (fs.existsSync(GRADES_PATH)) {
		try {
			const raw = fs.readFileSync(GRADES_PATH, "utf-8");

			grades = JSON.parse(raw);
		} catch {
			grades = [];
		}
	}

	// =====================================================
	// SHEET 4 — GRADES
	// =====================================================

	const gradesSheet = workbook.addWorksheet("Grades");

	gradesSheet.columns = [
		{
			header: "Symbol",
			key: "symbol",
			width: 18,
		},

		{
			header: "Signal",
			key: "signal",
			width: 18,
		},

		{
			header: "Grade",
			key: "grade",
			width: 12,
		},

		{
			header: "PnL %",
			key: "pnlPercent",
			width: 12,
		},

		{
			header: "Status",
			key: "status",
			width: 12,
		},

		{
			header: "Score",
			key: "score",
			width: 10,
		},

		{
			header: "Confidence",
			key: "confidence",
			width: 12,
		},

		{
			header: "Qualified",
			key: "qualified",
			width: 12,
		},
	];

	gradesSheet.autoFilter = {
		from: "A1",
		to: "H1",
	};

	gradesSheet.views = [
		{
			state: "frozen",
			ySplit: 1,
		},
	];

	gradesSheet.getRow(1).font = {
		bold: true,
		color: { argb: "FFFFFF" },
	};

	gradesSheet.getRow(1).fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: {
			argb: "1F4E78",
		},
	};

	[...grades].reverse().forEach((g) => {
		const row = gradesSheet.addRow(g);

		let fillColor = "FFFFFF";

		if (g.grade === "A+") {
			fillColor = "C6EFCE";
		} else if (g.grade === "A") {
			fillColor = "E2F0D9";
		} else if (g.grade === "B") {
			fillColor = "FFF2CC";
		} else if (g.grade === "C") {
			fillColor = "FCE5CD";
		} else if (g.grade === "FAILED") {
			fillColor = "F4CCCC";
		}

		row.eachCell((cell) => {
			cell.fill = {
				type: "pattern",

				pattern: "solid",

				fgColor: {
					argb: fillColor,
				},
			};
		});
	});

	// =====================================================
	// LOAD RELIABILITY + ADAPTIVE DATA
	// =====================================================

	let reliability: any = {};

	let adaptiveWeights: any = {};

	let environmentAnalytics: any[] = [];

	let regimeAnalytics: any[] = [];

	let volatilityAnalytics: any[] = [];

	let confidenceCalibration: any = {};

	let positionSizing: any = {};

	let riskReward: any = {};

	let holdingPeriod: any = {};

	let exitSummary: any = {};

	try {
		if (fs.existsSync(VOLATILITY_ANALYTICS_PATH)) {
			volatilityAnalytics = JSON.parse(
				fs.readFileSync(VOLATILITY_ANALYTICS_PATH, "utf-8"),
			);
		}
		if (fs.existsSync(REGIME_ANALYTICS_PATH)) {
			regimeAnalytics = JSON.parse(
				fs.readFileSync(REGIME_ANALYTICS_PATH, "utf-8"),
			);
		}
		if (fs.existsSync(RELIABILITY_PATH)) {
			reliability = JSON.parse(fs.readFileSync(RELIABILITY_PATH, "utf-8"));
		}

		if (fs.existsSync(ADAPTIVE_PATH)) {
			adaptiveWeights = JSON.parse(fs.readFileSync(ADAPTIVE_PATH, "utf-8"));
		}
		if (fs.existsSync(ENVIRONMENT_ANALYTICS_PATH)) {
			environmentAnalytics = JSON.parse(
				fs.readFileSync(ENVIRONMENT_ANALYTICS_PATH, "utf-8"),
			);
		}

		if (fs.existsSync(CONFIDENCE_CALIBRATION_PATH)) {
			confidenceCalibration = JSON.parse(
				fs.readFileSync(CONFIDENCE_CALIBRATION_PATH, "utf-8"),
			);
		}

		if (fs.existsSync(POSITION_SIZING_PATH)) {
			positionSizing = JSON.parse(
				fs.readFileSync(POSITION_SIZING_PATH, "utf-8"),
			);
		}

		if (fs.existsSync(RISK_REWARD_PATH)) {
			riskReward = JSON.parse(fs.readFileSync(RISK_REWARD_PATH, "utf-8"));
		}

		if (fs.existsSync(HOLDING_PERIOD_PATH)) {
			holdingPeriod = JSON.parse(fs.readFileSync(HOLDING_PERIOD_PATH, "utf-8"));
		}

		if (fs.existsSync(EXIT_SUMMARY_PATH)) {
			exitSummary = JSON.parse(fs.readFileSync(EXIT_SUMMARY_PATH, "utf-8"));
		}
	} catch {
		console.log("Analytics dashboard load failed");
	}

	// =====================================================
	// SHEET 5 — RELIABILITY
	// =====================================================

	const reliabilitySheet = workbook.addWorksheet("Reliability");

	reliabilitySheet.columns = [
		{
			header: "Metric",
			key: "metric",
			width: 30,
		},

		{
			header: "Value",
			key: "value",
			width: 20,
		},
	];

	reliabilitySheet.getRow(1).font = {
		bold: true,
		color: {
			argb: "FFFFFF",
		},
	};

	reliabilitySheet.getRow(1).fill = {
		type: "pattern",

		pattern: "solid",

		fgColor: {
			argb: "1F4E78",
		},
	};

	reliabilitySheet.addRows([
		{
			metric: "Qualified Accuracy",

			value: reliability.qualifiedAccuracy ?? "N/A",
		},
	]);

	// =====================================================
	// SHEET 6 — TOP SYMBOLS
	// =====================================================

	const topSymbolsSheet = workbook.addWorksheet("Top Symbols");

	topSymbolsSheet.columns = [
		{
			header: "Symbol",
			key: "symbol",
			width: 20,
		},

		{
			header: "Win Rate",
			key: "winRate",
			width: 15,
		},

		{
			header: "Total Signals",
			key: "totalSignals",
			width: 18,
		},
	];

	topSymbolsSheet.getRow(1).font = {
		bold: true,
		color: {
			argb: "FFFFFF",
		},
	};

	topSymbolsSheet.getRow(1).fill = {
		type: "pattern",

		pattern: "solid",

		fgColor: {
			argb: "1F4E78",
		},
	};

	(reliability.bestSymbols ?? []).forEach((s: any) => {
		topSymbolsSheet.addRow(s);
	});

	// =====================================================
	// SHEET 7 — TOP SIGNALS
	// =====================================================

	const topSignalsSheet = workbook.addWorksheet("Top Signals");

	topSignalsSheet.columns = [
		{
			header: "Signal",
			key: "signal",
			width: 20,
		},

		{
			header: "Win Rate",
			key: "winRate",
			width: 15,
		},

		{
			header: "Total Signals",
			key: "totalSignals",
			width: 18,
		},
	];

	topSignalsSheet.getRow(1).font = {
		bold: true,
		color: {
			argb: "FFFFFF",
		},
	};

	topSignalsSheet.getRow(1).fill = {
		type: "pattern",

		pattern: "solid",

		fgColor: {
			argb: "1F4E78",
		},
	};

	(reliability.bestSignals ?? []).forEach((s: any) => {
		topSignalsSheet.addRow(s);
	});

	// =====================================================
	// SHEET 8 — ADAPTIVE WEIGHTS
	// =====================================================

	const adaptiveSheet = workbook.addWorksheet("Adaptive Weights");

	adaptiveSheet.columns = [
		{
			header: "Type",
			key: "type",
			width: 15,
		},

		{
			header: "Name",
			key: "name",
			width: 25,
		},

		{
			header: "Weight",
			key: "weight",
			width: 15,
		},
	];

	adaptiveSheet.getRow(1).font = {
		bold: true,
		color: { argb: "FFFFFF" },
	};

	adaptiveSheet.getRow(1).fill = {
		type: "pattern",

		pattern: "solid",

		fgColor: {
			argb: "1F4E78",
		},
	};

	// ======================
	// SIGNAL WEIGHTS
	// ======================

	for (const [name, weight] of Object.entries(
		adaptiveWeights.signalWeights ?? {},
	)) {
		adaptiveSheet.addRow({
			type: "Signal",

			name,

			weight,
		});
	}

	// ======================
	// SYMBOL WEIGHTS
	// ======================

	for (const [name, weight] of Object.entries(
		adaptiveWeights.symbolWeights ?? {},
	)) {
		adaptiveSheet.addRow({
			type: "Symbol",

			name,

			weight,
		});
	}

	// =====================================================
	// SHEET 9 — ENVIRONMENT ANALYTICS
	// =====================================================

	const environmentSheet = workbook.addWorksheet("Environment Analytics");

	environmentSheet.columns = [
		{
			header: "Environment",
			key: "environment",
			width: 35,
		},

		{
			header: "Trades",
			key: "totalTrades",
			width: 12,
		},

		{
			header: "Wins",
			key: "wins",
			width: 10,
		},

		{
			header: "Losses",
			key: "losses",
			width: 10,
		},

		{
			header: "Open",
			key: "open",
			width: 10,
		},

		{
			header: "Win Rate %",
			key: "winRate",
			width: 15,
		},

		{
			header: "Average PnL %",
			key: "averagePnL",
			width: 18,
		},
	];

	environmentSheet.getRow(1).font = {
		bold: true,
		color: {
			argb: "FFFFFF",
		},
	};

	environmentSheet.getRow(1).fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: {
			argb: "1F4E78",
		},
	};

	environmentSheet.autoFilter = {
		from: "A1",
		to: "G1",
	};

	environmentSheet.views = [
		{
			state: "frozen",
			ySplit: 1,
		},
	];

	[...environmentAnalytics]
		.sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0))
		.forEach((env) => {
			const row = environmentSheet.addRow(env);

			const winRate = Number(env.winRate ?? 0);

			if (winRate >= 70) {
				row.eachCell((cell) => {
					cell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: {
							argb: "C6EFCE",
						},
					};
				});
			} else if (winRate <= 40) {
				row.eachCell((cell) => {
					cell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: {
							argb: "F4CCCC",
						},
					};
				});
			}
		});

	// =====================================================
	// SHEET 10 — REGIME ANALYTICS
	// =====================================================

	const regimeSheet = workbook.addWorksheet("Regime Analytics");

	regimeSheet.columns = [
		{
			header: "Regime",
			key: "regime",
			width: 25,
		},

		{
			header: "Trades",
			key: "totalTrades",
			width: 12,
		},

		{
			header: "Wins",
			key: "wins",
			width: 10,
		},

		{
			header: "Losses",
			key: "losses",
			width: 10,
		},

		{
			header: "Open",
			key: "open",
			width: 10,
		},

		{
			header: "Win Rate %",
			key: "winRate",
			width: 15,
		},

		{
			header: "Average PnL %",
			key: "averagePnL",
			width: 18,
		},
	];

	regimeSheet.getRow(1).font = {
		bold: true,
		color: {
			argb: "FFFFFF",
		},
	};

	regimeSheet.getRow(1).fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: {
			argb: "1F4E78",
		},
	};

	regimeSheet.autoFilter = {
		from: "A1",
		to: "G1",
	};

	regimeSheet.views = [
		{
			state: "frozen",
			ySplit: 1,
		},
	];

	[...regimeAnalytics]
		.sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0))
		.forEach((regime) => {
			const row = regimeSheet.addRow(regime);

			const winRate = Number(regime.winRate ?? 0);

			if (winRate >= 70) {
				row.eachCell((cell) => {
					cell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: {
							argb: "C6EFCE",
						},
					};
				});
			} else if (winRate <= 40) {
				row.eachCell((cell) => {
					cell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: {
							argb: "F4CCCC",
						},
					};
				});
			}
		});

	// =====================================================
	// SHEET 11 — VOLATILITY ANALYTICS
	// =====================================================

	const volatilitySheet = workbook.addWorksheet("Volatility Analytics");

	volatilitySheet.columns = [
		{
			header: "Volatility",
			key: "volatilityRegime",
			width: 25,
		},
		{
			header: "Trades",
			key: "totalTrades",
			width: 12,
		},
		{
			header: "Wins",
			key: "wins",
			width: 10,
		},
		{
			header: "Losses",
			key: "losses",
			width: 10,
		},
		{
			header: "Open",
			key: "open",
			width: 10,
		},
		{
			header: "Win Rate %",
			key: "winRate",
			width: 15,
		},
		{
			header: "Average PnL %",
			key: "averagePnL",
			width: 18,
		},
	];

	volatilitySheet.getRow(1).font = {
		bold: true,
		color: {
			argb: "FFFFFF",
		},
	};

	volatilitySheet.getRow(1).fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: {
			argb: "1F4E78",
		},
	};

	volatilitySheet.autoFilter = {
		from: "A1",
		to: "G1",
	};

	volatilitySheet.views = [
		{
			state: "frozen",
			ySplit: 1,
		},
	];

	[...volatilityAnalytics]
		.sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0))
		.forEach((volatility) => {
			const row = volatilitySheet.addRow(volatility);

			const winRate = Number(volatility.winRate ?? 0);

			if (winRate >= 70) {
				row.eachCell((cell) => {
					cell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: {
							argb: "C6EFCE",
						},
					};
				});
			} else if (winRate <= 40) {
				row.eachCell((cell) => {
					cell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: {
							argb: "F4CCCC",
						},
					};
				});
			}
		});

	// =====================================================
	// SHEET 12 — Confidence Calibration
	// =====================================================

	const confidenceSheet = workbook.addWorksheet("Confidence Calibration");

	confidenceSheet.columns = [
		{
			header: "Confidence",
			key: "confidence",
			width: 15,
		},
		{
			header: "Win Rate",
			key: "winRate",
			width: 15,
		},
		{
			header: "Completed Trades",
			key: "completedTrades",
			width: 18,
		},
		{
			header: "Reliable",
			key: "reliable",
			width: 12,
		},
		{
			header: "Average Return",
			key: "averageReturn",
			width: 18,
		},
		{
			header: "Expectancy",
			key: "expectancy",
			width: 15,
		},
	];
	confidenceSheet.getRow(1).font = {
		bold: true,
		color: {
			argb: "FFFFFF",
		},
	};

	confidenceSheet.getRow(1).fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: {
			argb: "1F4E78",
		},
	};

	confidenceSheet.views = [
		{
			state: "frozen",
			ySplit: 1,
		},
	];
	const confidenceRows = [
		...(confidenceCalibration.confidenceStats ?? []),
	].sort((a, b) => b.completedTrades - a.completedTrades);

	confidenceRows.forEach((row: any) => {
		confidenceSheet.addRow(row);
	});

	// =====================================================
	// SHEET 13 — Position Sizing
	// =====================================================
	const sizingSheet = workbook.addWorksheet("Position Sizing");

	sizingSheet.columns = [
		{
			header: "Confidence",
			key: "confidence",
			width: 15,
		},
		{
			header: "Win Rate",
			key: "winRate",
			width: 15,
		},
		{
			header: "Recommendation",
			key: "recommendation",
			width: 20,
		},
		{
			header: "Allocation %",
			key: "capitalAllocationPercent",
			width: 18,
		},
		{
			header: "Risk %",
			key: "riskPerTradePercent",
			width: 15,
		},
	];

	(positionSizing.rules ?? []).forEach((row: any) => sizingSheet.addRow(row));

	// =====================================================
	// SHEET 14 — Risk Reward
	// =====================================================
	const rrSheet = workbook.addWorksheet("Risk Reward");

	rrSheet.columns = [
		{
			header: "Metric",
			key: "metric",
			width: 30,
		},
		{
			header: "Value",
			key: "value",
			width: 20,
		},
	];

	Object.entries(riskReward).forEach(([key, value]) => {
		rrSheet.addRow({
			metric: key,
			value,
		});
	});
	// =====================================================
	// SHEET 15 — Holiding Period
	// =====================================================

	const holdingSheet = workbook.addWorksheet("Holding Analytics");
	holdingSheet.columns = [
		{
			header: "Metric",
			key: "metric",
			width: 30,
		},
		{
			header: "Value",
			key: "value",
			width: 20,
		},
	];

	Object.entries(holdingPeriod).forEach(([key, value]) => {
		holdingSheet.addRow({
			metric: key,
			value,
		});
	});

	// =====================================================
	// SHEET 16 — Exit Analytics Summary
	// =====================================================
	const exitSheet = workbook.addWorksheet("Exit Summary");
	exitSheet.columns = [
		{
			header: "Metric",
			key: "metric",
			width: 30,
		},
		{
			header: "Value",
			key: "value",
			width: 20,
		},
	];

	Object.entries(exitSummary).forEach(([key, value]) => {
		exitSheet.addRow({
			metric: key,
			value,
		});
	});

	// =====================================================
	// SHEET 17 — Adaptive Recommendations
	// =====================================================

	const recommendationsSheet = workbook.addWorksheet(
		"Adaptive Recommendations",
	);

	recommendationsSheet.columns = [
		{
			header: "Type",
			key: "type",
			width: 20,
		},
		{
			header: "Value",
			key: "value",
			width: 20,
		},
		{
			header: "Action",
			key: "action",
			width: 20,
		},
		{
			header: "Reason",
			key: "reason",
			width: 60,
		},
	];
	recommendationsSheet.getRow(1).font = {
		bold: true,
		color: {
			argb: "FFFFFF",
		},
	};

	recommendationsSheet.getRow(1).fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: {
			argb: "1F4E78",
		},
	};
	(adaptiveWeights.recommendations ?? []).forEach((r: any) => {
		const row = recommendationsSheet.addRow(r);

		if (r.action === "BOOST") {
			row.eachCell((cell) => {
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: {
						argb: "C6EFCE",
					},
				};
			});
		}

		if (r.action === "PENALIZE") {
			row.eachCell((cell) => {
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: {
						argb: "F4CCCC",
					},
				};
			});
		}

		if (r.action === "WATCH") {
			row.eachCell((cell) => {
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: {
						argb: "FFF2CC",
					},
				};
			});
		}
	});
	recommendationsSheet.views = [
		{
			state: "frozen",
			ySplit: 1,
		},
	];
	// =====================================================
	// SAVE
	// =====================================================

	const exportPath = path.join(process.cwd(), "scanner-results.xlsx");

	await workbook.xlsx.writeFile(exportPath);

	console.log("Excel exported successfully");
}
