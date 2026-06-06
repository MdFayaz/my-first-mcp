import { TradingCalendarService } from "./services/tradingCalendarService.js";

const calendar = new TradingCalendarService();

console.log("Latest Trading Day:", calendar.getLatestTradingDate());

console.log(calendar.getTradingDaysBetween("2026-06-01", "2026-06-10"));
console.log("Republic Day:", calendar.isTradingDay(new Date("2026-01-26")));
