import { RunRepository } from "./storage/repositories/runRepository.js";

const repo = new RunRepository();

const runId = repo.createRun("2026-06-04");

console.log("Created Run:", runId);

repo.markSuccess(runId);

console.log(repo.getLatestRun());
