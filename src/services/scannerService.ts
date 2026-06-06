import { scanMarket } from "../scanner/marketScanner.js";

export class ScannerService {
	async scan() {
		return await scanMarket();
	}
}
