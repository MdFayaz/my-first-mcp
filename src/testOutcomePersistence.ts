import { OutcomePersistenceService } from "./services/outcomePersistenceService.js";

const service = new OutcomePersistenceService();

service.saveOutcome({
	signalId: 100,
	result: "WIN",
	returnPct: 7.25,
	holdingDays: 4,
	maxDrawdown: -1.5,
});

console.log(service.getOutcome(100));

console.log(service.getAllOutcomes().length);
