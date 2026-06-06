import { OutcomeRepository } from "./storage/repositories/outcomeRepository.js";

const repo = new OutcomeRepository();

repo.upsertOutcome({
	signalId: 1,
	result: "WIN",
	returnPct: 4.75,
	holdingDays: 5,
	maxDrawdown: -1.2,
});

console.log(repo.getOutcome(1));

console.log(repo.getAllOutcomes());
