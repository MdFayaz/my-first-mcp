export interface VolumeExpansionResult {
	currentVolume: number;

	previousVolume: number;

	expansionRatio: number;

	expanding: boolean;

	strength: "WEAK" | "NORMAL" | "STRONG" | "EXTREME";
}

export function detectVolumeExpansion(
	volumes: number[],
): VolumeExpansionResult {
	if (volumes.length < 2) {
		return {
			currentVolume: 0,

			previousVolume: 0,

			expansionRatio: 0,

			expanding: false,

			strength: "WEAK",
		};
	}

	const currentVolume = volumes[volumes.length - 1] ?? 0;

	const previousVolume = volumes[volumes.length - 2] ?? 0;

	const expansionRatio =
		previousVolume === 0 ? 0 : currentVolume / previousVolume;

	const expanding = expansionRatio >= 1.2;

	let strength: "WEAK" | "NORMAL" | "STRONG" | "EXTREME" = "NORMAL";

	if (expansionRatio < 0.8) {
		strength = "WEAK";
	} else if (expansionRatio >= 1.5) {
		strength = "STRONG";
	}

	if (expansionRatio >= 2.5) {
		strength = "EXTREME";
	}

	return {
		currentVolume,

		previousVolume,

		expansionRatio: Number(expansionRatio.toFixed(2)),

		expanding,

		strength,
	};
}
