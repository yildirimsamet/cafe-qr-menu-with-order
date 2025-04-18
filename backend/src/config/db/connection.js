import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      connectTimeout: 0,
      waitForConnections: true,
      multipleStatements: true,
      reconnect: true,
    });

    setInterval(async () => {
      try {
        await connection.execute('SELECT 1');
      } catch (err) {
        console.error('Keep-alive sorgusu başarısız:', err);
      }
    }, 5 * 60 * 1000);

    connection.on('error', async (err) => {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Bağlantı koptu, yeniden bağlanılıyor...');
        await createConnection();
      } else {
        throw err;
      }
    });

    return connection;
  } catch (error) {
    setTimeout(createConnection, 2000); 
  }
};

const connection = await createConnection();
export default connection;