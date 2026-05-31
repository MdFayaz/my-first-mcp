import { scanMarket } from "./marketScanner.js";

import { exportScannerResults } from "./excelExporter.js";

async function run() {
	try {
		const results = await scanMarket();

		console.table(results);
		const summary = {
			// total: results.length,
			totalScanned: results.length,
			qualified: results.filter((r: any) => r.qualified === "YES").length,

			strongBuy: results.filter((r) => r.signal === "STRONG BUY").length,

			buy: results.filter((r) => r.signal === "BUY").length,

			sell: results.filter((r) => r.signal === "SELL").length,

			strongSell: results.filter((r) => r.signal === "STRONG SELL").length,
		};

		console.log("\nScanner Summary:");
		console.table(summary);
		exportScannerResults(results);

		console.log("Excel exported successfully");
	} catch (error) {
		console.error("Scanner failed:", error);
	}
}

run();
