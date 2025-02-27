import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'mysql',
  user: 'root',
  database: 'cafe',
  password: 'root',
  connectTimeout: 0,
  waitForConnections: true,
});

connection.on('error', (err) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    setTimeout(() => {
      connection.connect();
    }, 1000);
  } else {
    throw err;
  }
});

export default connection;
