import { calculateConfluenceScore } from "../src/core/scoring/confluenceScore.js";

const score = calculateConfluenceScore({
	rsiScore: 70,

	macdScore: 65,

	trendStrength: 35,

	structureScore: 40,

	patternScore: 75,

	rejectionScore: 60,

	volatilityScore: 50,

	breakoutScore: 80,
});

console.log("Confluence Score:", score);
