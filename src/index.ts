import os from "os";
import { successResponse, errorResponse } from "./utils/response.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	generateMultiIndicatorSignal,
	getRSIData,
	getSMAData,
	generateRSISignal,
	getStockPrice,
	getCandleData,
} from "./core/indicators/marketData.js";
import { generateMultiTimeframeSignal } from "./core/strategy.js";

import {
	ListToolsRequestSchema,
	CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
	{
		name: "my-first-server",
		version: "1.0.0",
	},
	{
		capabilities: {
			tools: {},
		},
	},
);

// Tool discovery handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [
			{
				name: "hello_tool",
				description: "Returns greeting message",
				inputSchema: {
					type: "object",
					properties: {
						name: {
							type: "string",
							description: "Name of the user",
						},
					},
					required: ["name"],
				},
			},
			{
				name: "add_numbers",
				description: "Adds two numbers",
				inputSchema: {
					type: "object",
					properties: {
						a: {
							type: "number",
						},
						b: {
							type: "number",
						},
					},
					required: ["a", "b"],
				},
			},
			{
				name: "system_info",
				description: "Returns system information",
				inputSchema: {
					type: "object",
					properties: {},
				},
			},
			{
				name: "multi_timeframe_signal",

				description: "Analyze multiple timeframes",

				inputSchema: {
					type: "object",

					properties: {
						symbol: {
							type: "string",
							description: "Stock symbol",
						},
					},

					required: ["symbol"],
				},
			},
			{
				name: "multi_indicator_signal",
				description: "Generate signal using RSI SMA EMA",
				inputSchema: {
					type: "object",
					properties: {
						symbol: {
							type: "string",
						},
						interval: {
							type: "string",
						},
					},
					required: ["symbol", "interval"],
				},
			},
			{
				name: "calculate_sma",
				description: "Calculate Simple Moving Average",
				inputSchema: {
					type: "object",
					properties: {
						symbol: {
							type: "string",
						},
						interval: {
							type: "string",
						},
						period: {
							type: "number",
						},
					},
					required: ["symbol", "interval", "period"],
				},
			},
			{
				name: "generate_signal",
				description: "Generate trading signal using RSI",
				inputSchema: {
					type: "object",
					properties: {
						symbol: {
							type: "string",
						},
						interval: {
							type: "string",
						},
					},
					required: ["symbol", "interval"],
				},
			},
			{
				name: "calculate_rsi",
				description: "Calculate RSI indicator",
				inputSchema: {
					type: "object",
					properties: {
						symbol: {
							type: "string",
						},
						interval: {
							type: "string",
						},
					},
					required: ["symbol", "interval"],
				},
			},
			{
				name: "get_candle_data",
				description: "Fetch OHLC candle data",
				inputSchema: {
					type: "object",
					properties: {
						symbol: {
							type: "string",
							description: "Stock symbol",
						},
						interval: {
							type: "string",
							description: "Candle interval",
						},
					},
					required: ["symbol", "interval"],
				},
			},
			{
				name: "get_stock_price",
				description: "Fetch stock price by symbol",
				inputSchema: {
					type: "object",
					properties: {
						symbol: {
							type: "string",
							description: "Stock symbol",
						},
					},
					required: ["symbol"],
				},
			},
		],
	};
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name, arguments: args } = request.params;

	switch (name) {
		case "hello_tool": {
			const userName = args?.name || "Guest";

			return {
				content: [
					{
						type: "text",
						text: `Hello ${userName}, your MCP server works!`,
					},
				],
			};
		}
		case "system_info": {
			return successResponse({
				platform: os.platform(),
				arch: os.arch(),
				cpuCores: os.cpus().length,
				freeMemory: os.freemem(),
				totalMemory: os.totalmem(),
				uptime: os.uptime(),
			});
		}
		case "multi_timeframe_signal": {
			const symbol = String(args?.symbol).trim();

			try {
				const result = await generateMultiTimeframeSignal(symbol);

				return successResponse(result);
			} catch (error: any) {
				return errorResponse(error);
			}
		}
		case "multi_indicator_signal": {
			const symbol = String(args?.symbol).trim();
			const interval = String(args?.interval).trim();

			try {
				const result = await generateMultiIndicatorSignal(symbol, interval);

				return successResponse(result);
			} catch (error: any) {
				return errorResponse(error);
			}
		}
		case "calculate_sma": {
			const symbol = String(args?.symbol).trim();

			const interval = String(args?.interval).trim();

			const period = Number(args?.period);

			try {
				const result = await getSMAData(symbol, interval, period);

				return {
					content: [
						{
							type: "text",

							text: JSON.stringify(result, null, 2),
						},
					],
				};
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: `Error: ${error.message}`,
						},
					],
				};
			}
		}
		case "generate_signal": {
			const symbol = String(args?.symbol).trim();

			const interval = String(args?.interval).trim();

			try {
				const result = await generateRSISignal(symbol, interval);

				return successResponse(result);
			} catch (error: any) {
				return errorResponse(error);
			}
		}
		case "calculate_rsi": {
			const symbol = String(args?.symbol).trim();

			const interval = String(args?.interval).trim();

			try {
				const result = await getRSIData(symbol, interval);

				return successResponse(result);
			} catch (error: any) {
				return errorResponse(error);
			}
		}
		case "get_candle_data": {
			const symbol = String(args?.symbol).trim();

			const interval = String(args?.interval).trim();

			try {
				const result = await getCandleData(symbol, interval);

				return successResponse(result);
			} catch (error: any) {
				return errorResponse(error);
			}
		}
		case "get_stock_price": {
			const symbol = String(args?.symbol).trim();

			try {
				const result = await getStockPrice(symbol);

				return successResponse(result);
			} catch (error: any) {
				return errorResponse(error);
			}
		}
		case "add_numbers": {
			const a = Number(args?.a);
			const b = Number(args?.b);

			return {
				content: [
					{
						type: "text",
						text: `Result = ${a + b}`,
					},
				],
			};
		}
		default:
			throw new Error(`Unknown tool: ${name}`);
	}
});

async function main() {
	const transport = new StdioServerTransport();

	await server.connect(transport);

	console.error("MCP Server running...");
}

main().catch((error) => {
	console.error("Server failed:", error);
});
