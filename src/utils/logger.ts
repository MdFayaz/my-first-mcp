import fs from "fs";

export class Logger {
	private readonly logFile = "logs/app.log";

	info(message: string): void {
		this.write("INFO", message);
	}

	error(message: string): void {
		this.write("ERROR", message);
	}

	private write(level: string, message: string): void {
		fs.mkdirSync("logs", {
			recursive: true,
		});

		const line = `[${new Date().toISOString()}] ` + `[${level}] ${message}\n`;

		fs.appendFileSync(this.logFile, line, "utf8");
	}
}
