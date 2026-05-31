import fs from "fs";

import path from "path";

import { replayMarket } from "./replayEngine.js";

const filePath = path.resolve("./src/backtest/sampleData.json");

const rawData = fs.readFileSync(filePath, "utf-8");

const candles = JSON.parse(rawData);

replayMarket(candles);
