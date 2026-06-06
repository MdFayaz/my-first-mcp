import { ScoreRecommendationEngine } from "./performance/scoreRecommendationEngine.js";

const engine = new ScoreRecommendationEngine();

const report = engine.generateReport();

engine.saveReport();

console.log("");
console.log("===== SCORE RECOMMENDATIONS =====");
console.log("");

console.log(`Sample Size: ${report.sampleSize}`);

console.log("");

for (const recommendation of report.recommendations) {
	console.log(`Category   : ${recommendation.category}`);

	console.log(`Target     : ${recommendation.target}`);

	console.log(`Adjustment : ${recommendation.adjustment}`);

	console.log(`Confidence : ${recommendation.confidence}`);

	console.log(`Reason     : ${recommendation.reason}`);

	console.log("");
	console.log("--------------------------------");
	console.log("");
}

console.log("Report written to performance/scoreRecommendations.json");

console.log("");
