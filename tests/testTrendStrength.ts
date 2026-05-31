import { calculateTrendStrength } from "../src/core/structure/trendStrength.js";

console.log("BULLISH TREND");

const bullish = calculateTrendStrength(101.2, 100, 0.6, 1.8, 102);

console.log(bullish);

console.log("\nBEARISH TREND");

const bearish = calculateTrendStrength(98.5, 100, -0.7, 2, 99);

console.log(bearish);

console.log("\nSIDEWAYS TREND");

const sideways = calculateTrendStrength(100, 100.1, 0.05, 0.8, 100);

console.log(sideways);
