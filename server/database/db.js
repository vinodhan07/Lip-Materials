const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Create database file
const dbPath = path.join(__dirname, 'ecommerce.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database with schema
const initDatabase = () => {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolons and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
        if (statement.trim()) {
            db.exec(statement + ';');
        }
    }

    console.log('Database initialized successfully');
};

// Run initialization
try {
    initDatabase();
} catch (error) {
    console.error('Database initialization error:', error);
}

module.exports = db;
