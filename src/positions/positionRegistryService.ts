import crypto from "crypto";

import { PositionRepository } from "./positionRepository.js";
import type { Position } from "./position.js";
import { PositionStatus } from "./position.js";

import { HoldingPeriodRecommendationRepository } from "../analytics/holdingPeriodRecommendationRepository.js";

export class PositionRegistryService {
	private readonly repository = new PositionRepository();

	private readonly holdingRepository =
		new HoldingPeriodRecommendationRepository();

	registerPosition(symbol: string, signal: string, entryPrice: number): void {
		const existingPosition = this.repository.findOpenPosition(symbol);

		if (existingPosition) {
			console.log(`Position already exists for ${symbol}`);

			return;
		}

		const recommendation = this.holdingRepository.getRecommendation(signal);

		const position: Position = {
			id: crypto.randomUUID(),

			symbol,

			signal,

			entryPrice,

			recommendedHoldDays: recommendation?.suggestedHoldDays ?? 1,

			openedAt: new Date().toISOString(),

			status: PositionStatus.OPEN,
		};

		this.repository.save(position);
	}
}
