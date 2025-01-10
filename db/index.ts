import Database from 'better-sqlite3';
import path from 'path';

import { initUsers } from './users';

export function createDatabase() {
    const dbPath = path.join(__dirname, '/data/database.sqlite');
    const db = new Database(dbPath);
    return {
        users: initUsers(db),
    }
}
