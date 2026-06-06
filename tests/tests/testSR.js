import { detectSupportResistance } from "../core/structure/supportResistance.js";
const candles = [
    { high: 100, low: 95, close: 98 },
    { high: 102, low: 94, close: 101 },
    { high: 105, low: 90, close: 104 }, // support
    { high: 103, low: 93, close: 102 },
    { high: 106, low: 96, close: 105 },
    { high: 110, low: 100, close: 109 }, // resistance
    { high: 107, low: 101, close: 103 },
    { high: 104, low: 98, close: 99 },
];
const levels = detectSupportResistance(candles);
console.log(JSON.stringify(levels, null, 2));
//# sourceMappingURL=testSR.js.map