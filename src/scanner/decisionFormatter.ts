export function formatDecision(result: any) {
	return {
		symbol: result.symbol,

		signal: result.signal,

		confidence: result.confidence,

		adaptiveConfidence: result.adaptiveConfidence ?? result.confidence,

		adaptiveSignalMultiplier: result.adaptiveSignalMultiplier ?? 1,

		adaptiveSymbolMultiplier: result.adaptiveSymbolMultiplier ?? 1,

		adaptiveConfidenceMultiplier: result.adaptiveConfidenceMultiplier ?? 1,

		score: result.adjustedFinalScore ?? result.combinedScore,

		reasons: result.topReasons ?? result.reasons ?? [],

		VWAP: result.VWAP?.value ?? 0,

		VWAPPosition: result.VWAP?.position ?? "BELOW",

		VWAPDistance: result.VWAP?.distance ?? 0,

		RVOL: result.RVOL?.rvol ?? 0,

		RVOLStrength: result.RVOL?.strength ?? "LOW",

		ExpansionRatio: result.VolumeExpansion?.expansionRatio ?? 0,

		ExpansionStrength: result.VolumeExpansion?.strength ?? "WEAK",

		VolumeExpanding: result.VolumeExpansion?.expanding ?? false,

		ATRPercent: result.ATRPercent ?? 0,

		regime: result.regime?.regime ?? "UNKNOWN",

		regimeConfidence: result.regime?.confidence ?? 0,

		environment: result.environment ?? "",

		environmentReason: result.environmentReason ?? "",

		environmentScoreMultiplier: result.environmentScoreMultiplier ?? 1,

		environmentConfidenceMultiplier:
			result.environmentConfidenceMultiplier ?? 1,

		reliabilityMultiplier: result.reliabilityMultiplier ?? 1,

		rawEnvironmentScore: result.rawEnvironmentScore ?? 0,

		finalEnvironmentScore: result.finalEnvironmentScore ?? 0,

		reliabilityRegimeMultiplier: result.reliabilityRegimeMultiplier ?? 1,

		reliabilityVolatilityMultiplier:
			result.reliabilityVolatilityMultiplier ?? 1,

		reliabilityEnvironmentMultiplier:
			result.reliabilityEnvironmentMultiplier ?? 1,

		volatilityRegime: result.volatility?.volatilityRegime ?? "",

		volatilityConfidence: result.volatility?.confidence ?? 0,

		volatilityATRRatio: result.volatility?.atrRatio ?? 0,

		executionVolatilityRegime:
			result.executionVolatility?.volatilityRegime ?? "",

		executionVolatilityConfidence: result.executionVolatility?.confidence ?? 0,

		higherTimeframeRegime: result.higherTimeframeRegime?.regime ?? "UNKNOWN",

		executionRegime: result.executionRegime?.regime ?? "UNKNOWN",

		baseConfidence: result.baseConfidence ?? 0,

		reliabilityAdjustedConfidence: result.reliabilityAdjustedConfidence ?? 0,

		entryPrice: result.entryPrice,
	};
}
