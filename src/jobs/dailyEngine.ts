import { AccuracyEngine } from "../validation/accuracyEngine.js";
import { PerformanceAnalytics } from "../validation/performanceAnalytics.js";
import { OutcomeTracker } from "../validation/outcomeTracker.js";
import { AdaptiveFeedbackEngine } from "../performance/adaptiveFeedbackEngine.js";
import { ScoreRecommendationEngine } from "../performance/scoreRecommendationEngine.js";
import { Logger } from "../utils/logger.js";
import { error } from "console";

export async function runDailyEngine(): Promise<void> {
	const logger = new Logger();
	try {
		logger.info("Daily engine started");
		console.log("");
		console.log("==================================");
		console.log("MCP DAILY ENGINE");
		console.log("==================================");
		console.log("");

		console.log("Step 1: Evaluating outcomes...");

		const outcomeTracker = new OutcomeTracker();

		await outcomeTracker.evaluatePendingSignals();

		console.log("✓ Outcome tracking complete");
		console.log("");
		logger.info("Outcome tracking complete");
		console.log("Step 2: Calculating accuracy...");

		const accuracy = new AccuracyEngine();

		const accuracyMetrics = accuracy.calculate();

		console.log(
			`✓ Accuracy calculated (${accuracyMetrics.totalSignals} signals)`,
		);

		console.log("");
		logger.info("Accuracy calculated");
		console.log("Step 3: Generating performance analytics...");

		const analytics = new PerformanceAnalytics();

		analytics.saveReport();

		console.log("✓ performanceAnalytics.json updated");

		console.log("");
		logger.info("Performance analytics generated");
		console.log("Step 4: Generating adaptive feedback...");

		const feedback = new AdaptiveFeedbackEngine();

		feedback.saveReport();

		console.log("✓ adaptiveFeedback.json updated");

		console.log("");
		logger.info("Adaptive feedback generated");
		console.log("Step 5: Generating score recommendations...");

		const recommendations = new ScoreRecommendationEngine();

		recommendations.saveReport();

		console.log("✓ scoreRecommendations.json updated");

		console.log("");
		logger.info("Score recommendations generated");
		console.log("==================================");
		console.log("DAILY ENGINE COMPLETE");
		console.log("==================================");
		console.log("");
	} catch (error) {
		logger.error(
			error instanceof Error ? (error.stack ?? error.message) : String(error),
		);
	}
}
