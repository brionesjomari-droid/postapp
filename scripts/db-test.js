const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql2/promise');

(async () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL not found in environment. See .env.local');
    process.exit(1);
  }

  try {
    const conn = await mysql.createConnection(url);
    const [rows] = await conn.query('SELECT 1 AS ok');
    console.log('DB connection successful:', rows);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('DB connection failed:', err.message || err);
    process.exit(2);
  }
})();
