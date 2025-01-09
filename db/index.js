const Database = require('better-sqlite3');
const path = require('path');

const users = require('./users');

function createDatabase() {
    const dbPath = path.join(__dirname, '/data/database.sqlite');
    const db = new Database(dbPath);
    return {
        users: users.init(db),
    }
}

module.exports = {
    createDatabase,
};