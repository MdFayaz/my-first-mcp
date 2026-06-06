import fs from "fs";
import path from "path";

export interface SentReviewAlert {
	symbol: string;
	signal?: string;
	reason: string;
	alertedAt: string;
}

export class ReviewAlertHistoryRepository {
	private readonly filePath = path.resolve("data", "reviewAlertsSent.json");

	constructor() {
		this.ensureFileExists();
	}

	getAll(): SentReviewAlert[] {
		return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
	}

	save(alerts: SentReviewAlert[]): void {
		fs.writeFileSync(this.filePath, JSON.stringify(alerts, null, 2));
	}

	append(alerts: SentReviewAlert[]): void {
		const existing = this.getAll();

		this.save([...existing, ...alerts]);
	}

	private ensureFileExists(): void {
		if (!fs.existsSync(this.filePath)) {
			fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
		}
	}
}
