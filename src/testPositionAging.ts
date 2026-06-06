import { PositionAgingService } from "./positions/positionAgingService.js";

const service = new PositionAgingService();

const report = service.generateAgingReport();

console.log(`Generated aging report for ${report.length} positions`);

console.log(JSON.stringify(report, null, 2));
