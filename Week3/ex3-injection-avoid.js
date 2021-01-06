import { queryDB, makeQuery, connection as conn } from './mysql-connection.js';

conn.on('error', (err) => {
  console.log('[mysql error]', err);
});
/*
SQL injection

You are given the below function which returns the population of a
specific country from the world database.
*/

function getPopulation(Country, name, code, cb) {
  const query = `SELECT Population FROM ${Country} WHERE Name = '${name}' and code = '${code}'`;
  console.log(query);
  conn.query(
    query,
    (err, result) => {
      if (err) cb(err);
      if (result.length === 0) {
        cb(new Error('Not found'));
        return;
      }
      cb(null, result);
    },
  );
}
/*
Example of regular usage of this function:
*/
conn.query('USE world');
getPopulation('country', 'Netherlands', 'NLD', (error, result) => {
  if (error) {
    console.error('Runtime error: ', error.message);
  } else {
    console.log(result);
  }
});

/*
Give an example of a value that can be passed as name and code that would
take advantage of SQL-injection and (fetch all the records in the database)
*/
getPopulation('country', "' OR 1=1 OR '", "' OR '", (error, result) => {
  if (error) {
    console.error('Runtime error: ', error.message);
  } else {
    console.log(result);
  }
});

conn.end();
