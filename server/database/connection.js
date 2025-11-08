const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'olivershop.db');

let db = null;

function getDatabase() {
    if (!db) {
        db = new Database(DB_PATH);
        db.pragma('foreign_keys = ON');
    }
    return db;
}

module.exports = { getDatabase };
