import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
});

pool
  .getConnection()
  .then((conn) => {
    console.log('Database connected successfully');
    conn.release(); // 연결 해제
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });



export default pool;