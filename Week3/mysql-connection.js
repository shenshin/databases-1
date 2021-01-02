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

export function makeQueries(queriesArray) {
  return Promise.all(queriesArray.map((q) => makeQuery(q)));
}

export const insertArray = (array, query) => Promise.all(array.map((r) => makeQuery(query, [r])));

export async function queryDB(callback) {
  try {
    await callback();
  } catch (error) {
    console.error(error.message);
  } finally {
    connection.end();
  }
}
