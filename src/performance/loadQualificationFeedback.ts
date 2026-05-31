import fs from "fs";
import path from "path";

const FILE_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"qualificationFeedback.json",
);

export function loadQualificationFeedback() {
	if (!fs.existsSync(FILE_PATH)) {
		return {};
	}

	try {
		return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
	} catch {
		return {};
	}
}
