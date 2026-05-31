import fs from "fs";

import path from "path";

const OUTCOMES_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"outcomes.json",
);

const GRADES_PATH = path.join(process.cwd(), "signalHistory", "grades.json");

export function generateGrades() {
	// ======================
	// CHECK FILE
	// ======================

	if (!fs.existsSync(OUTCOMES_PATH)) {
		console.log("No outcomes found.");

		return;
	}

	// ======================
	// LOAD OUTCOMES
	// ======================

	const raw = fs.readFileSync(OUTCOMES_PATH, "utf-8");

	const outcomes = JSON.parse(raw);

	// ======================
	// GENERATE GRADES
	// ======================

	const graded = outcomes.map((o: any) => {
		let grade = "C";

		// ======================
		// FAILED
		// ======================

		if (o.status === "LOSS") {
			grade = "FAILED";
		}

		// ======================
		// OPEN
		// ======================
		else if (o.status === "OPEN") {
			grade = "C";
		}

		// ======================
		// WIN LOGIC
		// ======================
		else if (o.status === "WIN") {
			if (o.pnlPercent >= 2 && o.confidence >= 100 && o.qualified === "YES") {
				grade = "A+";
			} else if (o.pnlPercent >= 1) {
				grade = "A";
			} else {
				grade = "B";
			}
		}

		return {
			...o,

			grade,
		};
	});

	// ======================
	// SAVE
	// ======================

	fs.writeFileSync(GRADES_PATH, JSON.stringify(graded, null, 2));

	// ======================
	// SUMMARY
	// ======================

	const summary = {
		"A+": graded.filter((g: any) => g.grade === "A+").length,

		A: graded.filter((g: any) => g.grade === "A").length,

		B: graded.filter((g: any) => g.grade === "B").length,

		C: graded.filter((g: any) => g.grade === "C").length,

		FAILED: graded.filter((g: any) => g.grade === "FAILED").length,
	};

	console.log("\n===== SIGNAL GRADES =====");

	console.table(summary);

	console.log("\nGrades saved successfully.");

	return graded;
}
