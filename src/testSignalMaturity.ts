import { SignalMaturityService } from "./services/signalMaturityService.js";

const service = new SignalMaturityService();

console.log("2026-05-20:", service.isMature("2026-05-20", 5));

console.log("2026-06-04:", service.isMature("2026-06-04", 5));
