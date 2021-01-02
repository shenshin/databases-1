import mysql from 'mysql';
import util from 'util';
/* Make a connection to your database, using your MySQL hyfuser login credentials */
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  charset: 'utf8',
});

export const makeQuery = util.promisify(connection.query.bind(connection));

export async function queryDB(action) {
  try {
    await action();
  } catch (error) {
    console.error(error.message);
  } finally {
    connection.end();
  }
}
