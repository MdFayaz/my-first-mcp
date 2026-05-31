import { detectBreakout } from "../../src/core/structure/breakoutEngine.js";
import { SRLevel } from "../../src/core/structure/supportResistance.js";

const candles = [
	{
		open: 100,
		high: 105,
		low: 99,
		close: 104,
		volume: 1000,
	},
	{
		open: 104,
		high: 112,
		low: 103,
		close: 111,
		volume: 1500,
	},
];

const srLevels: SRLevel[] = [
	{
		price: 108,

		type: "RESISTANCE",

		touches: 3,

		strength: 80,
	},
];

const result = detectBreakout(candles, srLevels, 2);

console.log(result);
