// POSTGRES connection
const { Pool } = require('pg')

let pool;
if (process.env.DATABASE_URL) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    pool = new Pool({
        database: 'gallerme',
    });
}

module.exports = pool
