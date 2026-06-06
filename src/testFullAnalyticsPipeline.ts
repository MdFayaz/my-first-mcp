import { generateReliabilityReport } from "./performance/reliabilityEngine.js";
import { generateQualificationFeedback } from "./performance/qualificationFeedback.js";
import { generateRegimeAnalytics } from "./analytics/regimeAnalytics.js";
import { generateEnvironmentAnalytics } from "./analytics/environmentAnalytics.js";
import { generateVolatilityAnalytics } from "./analytics/volatilityAnalytics.js";
import { generateExitAnalytics } from "./performance/exitAnalytics.js";
import { generateExitAnalyticsSummary } from "./performance/exitAnalyticsSummary.js";
import { generateHoldingPeriodAnalytics } from "./analytics/holdingPeriodAnalytics.js";
import { generateConfidenceCalibration } from "./analytics/confidenceCalibration.js";
import { generateRiskRewardOptimization } from "./analytics/riskRewardOptimization.js";
import { generatePositionSizing } from "./performance/positionSizing.js";
import { generateAdaptiveWeights } from "./performance/adaptiveWeights.js";

generateReliabilityReport();

generateQualificationFeedback();

generateRegimeAnalytics();

generateEnvironmentAnalytics();

generateVolatilityAnalytics();

generateExitAnalytics();

generateExitAnalyticsSummary();

generateHoldingPeriodAnalytics();

generateConfidenceCalibration();

generateRiskRewardOptimization();

generatePositionSizing();

generateAdaptiveWeights();

console.log("\n===== FULL ANALYTICS PIPELINE COMPLETE =====");
