import { HistoricalPriceService } from "./services/historicalPriceService.js";

const service = new HistoricalPriceService();

const close1d = await service.getCloseAfterTradingDays(
	"RELIANCE.NS",
	"2026-05-20",
	1,
);

const close3d = await service.getCloseAfterTradingDays(
	"RELIANCE.NS",
	"2026-05-20",
	3,
);

const close5d = await service.getCloseAfterTradingDays(
	"RELIANCE.NS",
	"2026-05-20",
	5,
);

console.log({
	close1d,
	close3d,
	close5d,
});
