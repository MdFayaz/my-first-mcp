import { RunHistoryService } from "./services/runHistoryService.js";
import { ProcessingStateService } from "./services/processingStateService.js";

const runService = new RunHistoryService();

const stateService = new ProcessingStateService();

const runId = runService.startRun("2026-06-04");

runService.completeRun(runId);

stateService.setLastProcessedDate("2026-06-04");

console.log(runService.getLatestRun());

console.log(stateService.getLastProcessedDate());
