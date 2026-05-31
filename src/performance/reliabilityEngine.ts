import fs from "fs";

import path from "path";

const GRADES_PATH = path.join(process.cwd(), "signalHistory", "grades.json");

const RELIABILITY_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"reliability.json",
);

export function generateReliabilityReport() {
	// ======================
	// CHECK FILE
	// ======================

	if (!fs.existsSync(GRADES_PATH)) {
		console.log("No grades found.");

		return;
	}

	// ======================
	// LOAD GRADES
	// ======================

	const raw = fs.readFileSync(GRADES_PATH, "utf-8");

	const grades = JSON.parse(raw);

	// =====================================================
	// SYMBOL RELIABILITY
	// =====================================================

	const symbolStats: Record<string, any> = {};

	for (const g of grades) {
		if (!symbolStats[g.symbol]) {
			symbolStats[g.symbol] = {
				total: 0,

				wins: 0,
			};
		}

		symbolStats[g.symbol].total++;

		if (g.status === "WIN") {
			symbolStats[g.symbol].wins++;
		}
	}

	const bestSymbols = Object.entries(symbolStats)
		.map(([symbol, data]: any) => ({
			symbol,

			winRate: ((data.wins / data.total) * 100).toFixed(2),

			totalSignals: data.total,
		}))
		.sort((a: any, b: any) => parseFloat(b.winRate) - parseFloat(a.winRate));

	// =====================================================
	// SIGNAL RELIABILITY
	// =====================================================

	const signalStats: Record<string, any> = {};

	for (const g of grades) {
		if (!signalStats[g.signal]) {
			signalStats[g.signal] = {
				total: 0,

				wins: 0,
			};
		}

		signalStats[g.signal].total++;

		if (g.status === "WIN") {
			signalStats[g.signal].wins++;
		}
	}

	const bestSignals = Object.entries(signalStats)
		.map(([signal, data]: any) => ({
			signal,

			winRate: ((data.wins / data.total) * 100).toFixed(2),

			totalSignals: data.total,
		}))
		.sort((a: any, b: any) => parseFloat(b.winRate) - parseFloat(a.winRate));

	// =====================================================
	// QUALIFICATION RELIABILITY
	// =====================================================

	const qualifiedSignals = grades.filter((g: any) => g.qualified === "YES");

	const qualifiedWins = qualifiedSignals.filter((g: any) => g.status === "WIN");

	const qualifiedAccuracy =
		qualifiedSignals.length > 0
			? ((qualifiedWins.length / qualifiedSignals.length) * 100).toFixed(2)
			: "0";

	// =====================================================
	// GRADE DISTRIBUTION
	// =====================================================

	const gradeDistribution = {
		"A+": grades.filter((g: any) => g.grade === "A+").length,

		A: grades.filter((g: any) => g.grade === "A").length,

		B: grades.filter((g: any) => g.grade === "B").length,

		C: grades.filter((g: any) => g.grade === "C").length,

		FAILED: grades.filter((g: any) => g.grade === "FAILED").length,
	};

	// =====================================================
	// BUILD REPORT
	// =====================================================

	const report = {
		timestamp: new Date().toISOString(),

		bestSymbols,

		bestSignals,

		qualifiedAccuracy: `${qualifiedAccuracy}%`,

		gradeDistribution,
	};

	// =====================================================
	// SAVE REPORT
	// =====================================================

	fs.writeFileSync(RELIABILITY_PATH, JSON.stringify(report, null, 2));

	// =====================================================
	// TERMINAL OUTPUT
	// =====================================================

	console.log("\n===== RELIABILITY REPORT =====");

	console.log("\nTop Symbols:");

	console.table(bestSymbols.slice(0, 5));

	console.log("\nTop Signals:");

	console.table(bestSignals);

	console.log("\nQualified Accuracy:", `${qualifiedAccuracy}%`);

	console.log("\nGrade Distribution:");

	console.table(gradeDistribution);

	console.log("\nReliability report saved successfully.");

	return report;
}
