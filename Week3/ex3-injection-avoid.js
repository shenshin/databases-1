import { queryDB, makeQuery, connection as conn } from './mysql-connection.js';

/*
SQL injection

You are given the below function which returns the population of a
specific country from the world database.
*/

function getPopulation(country, name, code, cb) {
  const query = `SELECT Population FROM ${country} WHERE Name = '${name}' and code = '${code}'`;
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
Example of possible regular usage of this function:
*/
conn.query('USE world');
getPopulation('country', 'Netherlands', 'NLD', (error, result) => {
  if (error) {
    console.error('Runtime error: ', error.message);
  } else {
    console.log('\nUnsafe getPopulation (Netherlands)\n', result);
  }
});

/*
Give an example of a value that can be passed as name and code that would
take advantage of SQL-injection and (fetch all the records in the database)
*/

// This function call retrieves all population records
// Is there a way to get everything from the other columns?
getPopulation('country', "' OR 1=1 OR '", "' OR '", (error, result) => {
  if (error) {
    console.error('Runtime error: ', error.message);
  } else {
    console.log('\nTrying to make SQL injection\n', result);
  }
});
/*
Rewrite the function so that it is no longer vulnerable to SQL injection
*/
/*
'mysql' node module documentation sais that in order to avoid injections
we should always use '?' placeholders in the queries
https://www.npmjs.com/package/mysql#escaping-query-values
*/
async function saferGetPopulation(name, code) {
  if (!name || !code) throw new Error('Specify country name and code!');
  const query = `
    SELECT Population
    FROM country
    WHERE Name = ? OR code = ?
  `;
  const result = await makeQuery(query, [name, code]);
  if (!result || result?.length === 0) throw new Error('No country found!');
  return result;
}

// the usage of safer version of getPopulation

queryDB(async () => {
  await makeQuery('USE world');

  console.log('\nSafer getPopulation (USA)');
  console.log(await saferGetPopulation('United States', 'USA'));

  console.log('\nTrying to pass the same parameters that previously caused safety issue:');
  console.log(await saferGetPopulation("' OR 1=1 OR '", "' OR '"));
});
