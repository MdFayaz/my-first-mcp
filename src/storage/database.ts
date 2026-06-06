import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

class MCPDatabase {
	private static instance: Database.Database;

	static getInstance(): Database.Database {
		if (!this.instance) {
			const dataDir = path.resolve("data");

			if (!fs.existsSync(dataDir)) {
				fs.mkdirSync(dataDir, { recursive: true });
			}

			const dbPath = path.join(dataDir, "mcp-engine.db");

			this.instance = new Database(dbPath);

			this.initialize();
		}

		return this.instance;
	}

	private static initialize() {
		const db = this.instance;

		db.exec(`
        
        CREATE TABLE IF NOT EXISTS engine_runs (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            run_date TEXT NOT NULL,

            status TEXT NOT NULL,

            started_at TEXT NOT NULL,

            completed_at TEXT,

            error_message TEXT
        );

        CREATE TABLE IF NOT EXISTS processing_state (

            id INTEGER PRIMARY KEY CHECK(id = 1),

            last_processed_date TEXT
        );

        INSERT OR IGNORE INTO processing_state (
            id,
            last_processed_date
        )
        VALUES (
            1,
            NULL
        );

        CREATE TABLE IF NOT EXISTS signals (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            symbol TEXT NOT NULL,

            signal_date TEXT NOT NULL,

            direction TEXT,

            score REAL,

            confidence REAL,

            entry_price REAL,

            stop_loss REAL,

            target_price REAL,

            setup_type TEXT,

            reasons TEXT,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(
                symbol,
                signal_date
            )
        );

        CREATE TABLE IF NOT EXISTS outcomes (

            signal_id INTEGER NOT NULL,

            result TEXT,

            return_pct REAL,

            holding_days INTEGER,

            max_drawdown REAL,

            PRIMARY KEY(signal_id)
        );

        CREATE TABLE IF NOT EXISTS signal_outcomes (

            signal_id INTEGER PRIMARY KEY,

            symbol TEXT NOT NULL,

            signal_date TEXT NOT NULL,

            signal TEXT NOT NULL,

            confidence REAL NOT NULL,

            qualified TEXT,

            regime TEXT,

            environment TEXT,

            volatility_regime TEXT,

            status TEXT NOT NULL,

            pnl_percent REAL NOT NULL,

            holding_days INTEGER NOT NULL,

            max_drawdown REAL,

            evaluated_at TEXT NOT NULL
        );

         CREATE TABLE IF NOT EXISTS alert_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            symbol TEXT NOT NULL,
            signal_type TEXT NOT NULL,

            confidence INTEGER,
            qualified INTEGER,

            alert_date TEXT NOT NULL,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        `);
	}
}

export const db = MCPDatabase.getInstance();
