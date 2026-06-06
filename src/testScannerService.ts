import { ScannerService } from "./services/scannerService.js";

const scanner = new ScannerService();

const results = await scanner.scan();

console.log(`Signals Generated: ${results.length}`);

if (results.length > 0) {
	console.log("First Signal:");

	console.log(JSON.stringify(results[0], null, 2));
}
