const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

let dbPool = mysql.createPool(dbConfig);
dbPool.getConnection()
    .then((connection) => {
        console.log('Database connected!');
        connection.release();
    })
    .catch((error) => {
        console.error('Database connection failed : ', error);
    });

module.exports = dbPool;