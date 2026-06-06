import { AdaptiveScoreConfigService } from "./performance/adaptiveScoreConfig.js";

const service = new AdaptiveScoreConfigService();

const config = service.load();

console.log("");
console.log("===== ADAPTIVE SCORE CONFIG =====");
console.log("");

console.dir(config, {
	depth: null,
});

console.log("");
