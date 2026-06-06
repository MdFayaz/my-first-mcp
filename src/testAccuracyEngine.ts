import { AccuracyEngine } from "./validation/accuracyEngine.js";

const engine = new AccuracyEngine();

const metrics = engine.calculate();

console.log("");
console.log("===== ACCURACY REPORT =====");
console.log("");

console.log(`Total Signals     : ${metrics.totalSignals}`);

console.log(`Winning Signals   : ${metrics.winningSignals}`);

console.log(`Losing Signals    : ${metrics.losingSignals}`);

console.log(`Win Rate          : ${metrics.winRate.toFixed(2)}%`);

console.log(`Loss Rate         : ${metrics.lossRate.toFixed(2)}%`);

console.log(`Average Return    : ${metrics.averageReturn.toFixed(2)}%`);

console.log(`Average Winner    : ${metrics.averageWinner.toFixed(2)}%`);

console.log(`Average Loser     : ${metrics.averageLoser.toFixed(2)}%`);

console.log(
	`Profit Factor     : ${
		Number.isFinite(metrics.profitFactor)
			? metrics.profitFactor.toFixed(2)
			: "∞"
	}`,
);

console.log("");
