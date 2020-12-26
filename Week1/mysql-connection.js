import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  charset: 'utf8',
});

export default connection;
