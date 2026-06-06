import { PerformanceAnalytics } from "./validation/performanceAnalytics.js";

const analytics = new PerformanceAnalytics();

const report = analytics.generateReport();

analytics.saveReport();

console.log("");
console.log("===== PERFORMANCE ANALYTICS =====");
console.log("");

console.log("OVERALL");
console.log(report.overall);

console.log("");

console.log("BY SIGNAL");
console.log(report.bySignal);

console.log("");

console.log("BY QUALIFICATION");
console.log(report.byQualification);

console.log("");

console.log("BY REGIME");
console.log(report.byRegime);

console.log("");

console.log("BY ENVIRONMENT");
console.log(report.byEnvironment);

console.log("");

console.log("BY VOLATILITY REGIME");
console.log(report.byVolatilityRegime);

console.log("");

console.log("BY CONFIDENCE BUCKET");
console.log(report.byConfidenceBucket);

console.log("");
console.log("Report written to performance/performanceAnalytics.json");
console.log("");
