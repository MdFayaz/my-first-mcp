import fs from "fs";

export interface ApprovedAdjustment {
	category: string;

	target: string;

	adjustment: number;
}

export interface AdaptiveScoreConfig {
	autoApply: boolean;

	approvedAdjustments: ApprovedAdjustment[];
}

export class AdaptiveScoreConfigService {
	private readonly filePath = "performance/adaptiveScoreConfig.json";

	load(): AdaptiveScoreConfig {
		if (!fs.existsSync(this.filePath)) {
			return this.createDefault();
		}

		return JSON.parse(
			fs.readFileSync(this.filePath, "utf8"),
		) as AdaptiveScoreConfig;
	}

	save(config: AdaptiveScoreConfig): void {
		fs.mkdirSync("performance", {
			recursive: true,
		});

		fs.writeFileSync(this.filePath, JSON.stringify(config, null, 2), "utf8");
	}

	private createDefault(): AdaptiveScoreConfig {
		const config: AdaptiveScoreConfig = {
			autoApply: false,

			approvedAdjustments: [],
		};

		this.save(config);

		return config;
	}
}
