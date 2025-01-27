const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database("./comments.db", (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
        // Create a table for comments if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                comment TEXT NOT NULL
            )
        `);
    }
});

module.exports = db;

