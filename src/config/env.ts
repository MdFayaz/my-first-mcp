import "dotenv/config";

function requireEnv(name: string): string {
	const value = process.env[name];

	if (!value || value.trim().length === 0) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

export const env = {
	telegramBotToken: requireEnv("TELEGRAM_BOT_TOKEN"),

	telegramChatId: requireEnv("TELEGRAM_CHAT_ID"),
};
