import { scanMarket } from "./scanner/marketScanner.js";

console.log("");
console.log("===== INTRADAY SCANNER TEST =====");
console.log("");

const results = await scanMarket();

console.log(`Results: ${results.length}`);

console.log("");

console.table(
	results.slice(0, 5).map((r) => ({
		symbol: r.symbol,
		signal: r.signal,
		confidence: r.confidence,
		qualified: r.qualified,
	})),
);

console.log("");
console.log("Scanner test complete");
console.log("");
