import { SignalPersistenceService } from "./services/signalPersistenceService.js";

const service = new SignalPersistenceService();

service.saveSignals([
	{
		symbol: "TEST.NS",
		signalDate: "2026-06-04",
		direction: "BUY",
		score: 75,
		confidence: 90,
		reasons: "Persistence Test",
	},
]);

console.log("Signal saved");
