import { trackSignalOutcomes } from "../performance/outcomeTracker.js";
import { analyzePerformance } from "../analytics/performanceAnalyzer.js";
import { generateEnvironmentAnalytics } from "../analytics/environmentAnalytics.js";
import { generateRegimeAnalytics } from "../analytics/regimeAnalytics.js";
import { generateVolatilityAnalytics } from "../analytics/volatilityAnalytics.js";
import { generateReliabilityFeedback } from "../performance/reliabilityFeedback.js";
import { generateQualificationFeedback } from "../performance/qualificationFeedback.js";
import { generateAdaptiveWeights } from "../performance/adaptiveWeights.js";
import { generateRiskRewardOptimization } from "../analytics/riskRewardOptimization.js";

async function run() {
	console.log("=================================");
	console.log("LEARNING PIPELINE STARTED");
	console.log("=================================");

	await trackSignalOutcomes();

	analyzePerformance();

	generateEnvironmentAnalytics();

	generateRegimeAnalytics();

	generateVolatilityAnalytics();

	generateReliabilityFeedback();

	generateQualificationFeedback();

	generateAdaptiveWeights();

	generateVolatilityAnalytics();
	generateRiskRewardOptimization();

	console.log("=================================");
	console.log("LEARNING PIPELINE COMPLETED");
	console.log("=================================");
}

run();
