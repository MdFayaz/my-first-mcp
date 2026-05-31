export interface RVOLResult {
	currentVolume: number;

	averageVolume: number;

	rvol: number;

	strength: "LOW" | "NORMAL" | "HIGH" | "EXTREME";
}

export function calculateRVOL(volumes: number[], lookback = 20): RVOLResult {
	if (!volumes.length) {
		return {
			currentVolume: 0,
			averageVolume: 0,
			rvol: 0,
			strength: "LOW",
		};
	}

	const recentVolumes = volumes.slice(-lookback);

	const averageVolume =
		recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;

	const currentVolume = volumes[volumes.length - 1] ?? 0;

	const rvol = averageVolume === 0 ? 0 : currentVolume / averageVolume;

	let strength: "LOW" | "NORMAL" | "HIGH" | "EXTREME" = "NORMAL";

	if (rvol < 0.8) {
		strength = "LOW";
	} else if (rvol >= 1.5) {
		strength = "HIGH";
	}

	if (rvol >= 2.5) {
		strength = "EXTREME";
	}

	return {
		currentVolume,

		averageVolume: Number(averageVolume.toFixed(2)),

		rvol: Number(rvol.toFixed(2)),

		strength,
	};
}
