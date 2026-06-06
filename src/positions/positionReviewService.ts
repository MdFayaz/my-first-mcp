import fs from "fs";
import path from "path";

export interface PositionReview {
	symbol: string;
	signal: string;

	daysHeld: number;
	recommendedHoldDays: number;

	reviewRequired: boolean;
	reviewReason: string;
}

interface PositionAgingRecord {
	symbol: string;
	signal: string;

	daysHeld: number;
	daysRemaining: number;

	recommendedHoldDays: number;

	holdStatus: "ACTIVE" | "REVIEW_DUE";
}

export class PositionReviewService {
	private readonly agingFilePath = path.resolve("data", "positionAging.json");

	private readonly outputFilePath = path.resolve(
		"data",
		"positionReviews.json",
	);

	generateReviews(): PositionReview[] {
		if (!fs.existsSync(this.agingFilePath)) {
			console.log("positionAging.json not found");

			return [];
		}

		const agingData: PositionAgingRecord[] = JSON.parse(
			fs.readFileSync(this.agingFilePath, "utf-8"),
		);

		const reviews: PositionReview[] = agingData
			.filter((position) => position.holdStatus === "REVIEW_DUE")
			.map((position) => ({
				symbol: position.symbol,

				signal: position.signal,

				daysHeld: position.daysHeld,

				recommendedHoldDays: position.recommendedHoldDays,

				reviewRequired: true,

				reviewReason: "Holding period exceeded",
			}));

		this.save(reviews);

		return reviews;
	}

	private save(reviews: PositionReview[]): void {
		fs.writeFileSync(this.outputFilePath, JSON.stringify(reviews, null, 2));
	}
}
