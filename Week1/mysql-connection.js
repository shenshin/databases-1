import mysql from 'mysql';
/* Make a connection to your database, using your MySQL hyfuser login credentials */
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  charset: 'utf8',
});

export default connection;
