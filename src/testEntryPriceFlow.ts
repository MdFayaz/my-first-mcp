import { ScannerService } from "./services/scannerService.js";

const scanner = new ScannerService();

const results = await scanner.scan();

console.log(JSON.stringify(results[0], null, 2));
