export const logger = {
	info: (...args: unknown[]) => {
		console.error("[INFO]", ...args);
	},

	error: (...args: unknown[]) => {
		console.error("[ERROR]", ...args);
	},

	debug: (...args: unknown[]) => {
		if (process.env.DEBUG) {
			console.error("[DEBUG]", ...args);
		}
	},
};
