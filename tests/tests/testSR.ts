import { detectSupportResistance } from "../src/core/structure/supportResistance.js";
const candles = [
	{ high: 100, low: 95, close: 98 },
	{ high: 102, low: 94, close: 101 },

	{ high: 105, low: 90, close: 104 }, // support pivot
	{ high: 103, low: 94, close: 102 },

	{ high: 106, low: 90.2, close: 105 }, // support pivot
	{ high: 104, low: 95, close: 103 },

	{ high: 107, low: 89.8, close: 106 }, // support pivot
	{ high: 105, low: 96, close: 104 },

	{ high: 110, low: 100, close: 109 }, // resistance pivot
	{ high: 106, low: 101, close: 103 },

	{ high: 110.2, low: 102, close: 108 }, // resistance pivot
	{ high: 107, low: 103, close: 104 },

	{ high: 109.8, low: 101, close: 107 }, // resistance pivot
	{ high: 104, low: 98, close: 99 },
];

const levels = detectSupportResistance(candles);

console.log(JSON.stringify(levels, null, 2));
