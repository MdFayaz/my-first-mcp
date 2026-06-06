import { NSE_HOLIDAYS_2026 } from "../config/nseHolidays.js";

export class TradingCalendarService {
	isTradingDay(date: Date): boolean {
		const day = date.getDay();

		if (day === 0 || day === 6) {
			return false;
		}

		const dateString = this.formatDate(date);

		return !NSE_HOLIDAYS_2026.has(dateString);
	}

	getTradingDaysBetween(fromDate: string, toDate: string): string[] {
		const dates: string[] = [];

		const current = new Date(fromDate);

		current.setDate(current.getDate() + 1);

		const end = new Date(toDate);

		while (current <= end) {
			if (this.isTradingDay(current)) {
				dates.push(this.formatDate(current));
			}

			current.setDate(current.getDate() + 1);
		}

		return dates;
	}

	getLatestTradingDate(): string {
		const today = new Date();

		while (!this.isTradingDay(today)) {
			today.setDate(today.getDate() - 1);
		}

		return this.formatDate(today);
	}

	private formatDate(date: Date): string {
		return date.toISOString().slice(0, 10);
	}
}
