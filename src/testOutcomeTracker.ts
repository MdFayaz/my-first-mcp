import { OutcomeTracker } from "./validation/outcomeTracker.js";

const tracker = new OutcomeTracker();

await tracker.evaluatePendingSignals();

console.log("Outcome evaluation complete");
