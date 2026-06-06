import { env } from "./config/env.js";

const response = await fetch(
	`https://api.telegram.org/bot${env.telegramBotToken}/getUpdates`,
);

const data = await response.json();

console.dir(data, {
	depth: null,
});
