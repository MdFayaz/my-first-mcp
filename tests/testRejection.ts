import { analyzeRejection } from "../src/core/structure/rejectionAnalysis.js";

const bullishCandle = {
	open: 100,
	close: 102,
	high: 103,
	low: 90,
};

const bearishCandle = {
	open: 102,
	close: 100,
	high: 115,
	low: 99,
};

console.log("BULLISH TEST");
console.log(analyzeRejection(bullishCandle));

console.log("\nBEARISH TEST");
console.log(analyzeRejection(bearishCandle));
