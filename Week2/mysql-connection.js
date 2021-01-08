import mysql from 'mysql';
import util from 'util';
import colors from 'colors';
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

export function printTable(queryResult) {
  queryResult.forEach((row) => {
    Object.entries(row).forEach(([key, val], ind, arr) => {
      process.stdout.write(`${key}: `);
      process.stdout.write(colors.green(val));
      process.stdout.write(ind === arr.length - 1 ? '\n' : ', ');
    });
  });
}
