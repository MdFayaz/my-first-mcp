export function calculateMTFConfluence({
	alignmentStrength,
	htfConfidence,
	executionValid,
	conflict,
}: any) {
	let score = 0;

	score += alignmentStrength * 0.4;
	score += htfConfidence * 0.4;

	if (executionValid) {
		score += 20;
	}

	if (conflict) {
		score -= 35;
	}

	return Math.max(0, Math.min(100, Number(score.toFixed(2))));
}
