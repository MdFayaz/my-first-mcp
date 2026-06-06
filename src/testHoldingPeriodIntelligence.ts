import { generateHoldingPeriodIntelligence } from "./analytics/holdingPeriodIntelligence.js";

const recommendations = generateHoldingPeriodIntelligence();

console.table(recommendations);
