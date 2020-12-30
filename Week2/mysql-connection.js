import mysql from 'mysql';
import util from 'util';
/**
 * Make a connection to your database, using your MySQL
 * hyfuser login credentials
 * */
export const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  charset: 'utf8',
});

export const makeQuery = util.promisify(connection.query.bind(connection));

export function insertArray(array, query) {
  return Promise.all(array.map((record) => makeQuery(query, [record])));
}
