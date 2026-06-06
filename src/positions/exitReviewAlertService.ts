import fs from "fs";
import path from "path";

export interface ExitReviewAlert {
	symbol: string;
	signal: string;
	daysHeld: number;
	recommendedHoldDays: number;
	reason: string;
}

interface PositionReview {
	symbol: string;
	signal: string;

	daysHeld: number;
	recommendedHoldDays: number;

	reviewRequired: boolean;
	reviewReason: string;
}

export class ExitReviewAlertService {
	private readonly reviewFilePath = path.resolve(
		"data",
		"positionReviews.json",
	);

	getAlerts(): ExitReviewAlert[] {
		if (!fs.existsSync(this.reviewFilePath)) {
			return [];
		}

		const reviews: PositionReview[] = JSON.parse(
			fs.readFileSync(this.reviewFilePath, "utf-8"),
		);

		return reviews
			.filter((review) => review.reviewRequired)
			.map((review) => ({
				symbol: review.symbol,
				signal: review.signal,
				daysHeld: review.daysHeld,
				recommendedHoldDays: review.recommendedHoldDays,
				reason: review.reviewReason,
			}));
	}
}
