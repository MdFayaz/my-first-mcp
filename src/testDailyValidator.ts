import { DailyValidator } from "./validation/dailyValidator.js";

const validator = new DailyValidator();

await validator.processDate("2026-06-04");
