import { ProcessingStateService } from "./services/processingStateService.js";
import { BackfillRunner } from "./validation/backfillRunner.js";

const state = new ProcessingStateService();

state.setLastProcessedDate("2026-05-28");

const runner = new BackfillRunner();

await runner.run();
