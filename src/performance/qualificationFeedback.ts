import fs from "fs";
import path from "path";

const ENV_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"environmentAnalytics.json",
);

const OUTPUT_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"qualificationFeedback.json",
);

export function generateQualificationFeedback() {
	if (!fs.existsSync(ENV_PATH)) {
		console.log("No environment analytics found.");
		return;
	}

	const environments = JSON.parse(fs.readFileSync(ENV_PATH, "utf-8"));

	const feedback: Record<string, any> = {};

	for (const env of environments) {
		let minConfidence = 70;

		let minScore = 25;

		if (env.winRate >= 70) {
			minConfidence = 60;
			minScore = 20;
		}

		if (env.winRate <= 40) {
			minConfidence = 80;
			minScore = 35;
		}

		feedback[env.environment] = {
			minConfidence,
			minScore,
		};
	}

	fs.writeFileSync(OUTPUT_PATH, JSON.stringify(feedback, null, 2));

	console.log(
		`Qualification feedback generated: ${Object.keys(feedback).length}`,
	);
}
