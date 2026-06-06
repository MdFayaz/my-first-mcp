import { AdaptiveFeedbackEngine } from "./performance/adaptiveFeedbackEngine.js";

const engine = new AdaptiveFeedbackEngine();

const report = engine.generateReport();

engine.saveReport();

console.log("");
console.log("===== ADAPTIVE FEEDBACK =====");
console.log("");

console.dir(report, {
	depth: null,
});

console.log("");
console.log("Report written to performance/adaptiveFeedback.json");
console.log("");
