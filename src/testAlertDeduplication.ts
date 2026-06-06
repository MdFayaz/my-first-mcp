import { AlertDeduplicationService } from "./notifications/alertDeduplicationService.js";
import { AlertDecision } from "./notifications/alertDecision.js";

async function main() {
	const service = new AlertDeduplicationService();

	const signal = {
		symbol: "ICICIBANK.NS",
		signalType: "STRONG BUY",
		confidence: 100,
		qualified: true,
	};

	const decision = await service.evaluate(signal);

	console.log("Decision:", decision);

	if (decision !== AlertDecision.DUPLICATE_SIGNAL) {
		await service.recordAlert(signal);
	}
}

main();
