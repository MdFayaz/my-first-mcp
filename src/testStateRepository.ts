import { StateRepository } from "./storage/repositories/stateRepository.js";

const repo = new StateRepository();

console.log("Before:", repo.getLastProcessedDate());

repo.setLastProcessedDate("2026-06-03");

console.log("After:", repo.getLastProcessedDate());
