import { PredictionTracker } from "./validation/predictionTracker.js";

const tracker = new PredictionTracker();

const pending = tracker.getPendingPredictions();

console.log(`Pending Predictions: ${pending.length}`);

console.log(pending.slice(0, 5));
