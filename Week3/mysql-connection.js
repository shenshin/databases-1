import mysql from 'mysql';
import colors from 'colors';
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

export async function queryDB(action) {
  try {
    await action();
  } catch (error) {
    console.error(colors.red.inverse(error.message));
  } finally {
    connection.end();
  }
}

export function printTable(queryResult) {
  const printObject = (object) => {
    Object.entries(object).forEach(([key, val], ind, arr) => {
      process.stdout.write(`${key}: `);
      process.stdout.write(colors.green(val));
      process.stdout.write(ind === arr.length - 1 ? '\n' : ', ');
    });
  };
  if (queryResult && typeof queryResult === 'object') {
    printObject(queryResult);
  } else if (queryResult && Array.isArray(queryResult) && queryResult.length > 0) {
    queryResult.forEach((row) => printObject(row));
  } else {
    throw new Error('Query result should be an object or array of objects');
  }
}
