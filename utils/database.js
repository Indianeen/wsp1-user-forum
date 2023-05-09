require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    charset: 'utf8mb4',
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    users: process.env.DATABASE_USERSTABLE,
    posts: process.env.DATABASE_POSTTABLE
});

module.exports = pool;



/*
DB_HOST,
DB_USER,
DB_PASSWORD,
DB_DATABASE,
DATABASE_USERSTABLE,
*/