module.exports = {
    init: (db) => {
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        return {
            insert: db.prepare('INSERT INTO users (email) VALUES (?)'),
            getById: db.prepare('SELECT * FROM users WHERE id = ?'),
            getAll: db.prepare('SELECT * FROM users'),
        }
    },
};