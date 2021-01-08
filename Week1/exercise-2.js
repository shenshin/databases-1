/*
  Write a JavaScript file (to be executed with Node.js) that queries
 (using select statements) the world database. The results given back
 should answer following questions: Don't omit to test your queries evey
  time.
*/
import { queryDB, makeQuery, printTable } from './mysql-connection.js';

// I belive here when the order of operations is important,
// the usage of 'await' is justified.
// Otherwise connection closes before the final query is executed
async function queryWorld() {
  await makeQuery('USE world');

  console.log('\nWhat are the names of countries with population greater than 8 million?');
  printTable(await makeQuery(`
    SELECT name
    FROM country
    WHERE population > 8000000
    ORDER BY population DESC
  `));

  console.log('\nWhat are the names of countries that have “land” in their names?');
  printTable(await makeQuery(`
    SELECT name
    FROM country
    WHERE name
      LIKE '%land%'
  `));

  console.log('\nWhat are the names of the cities with population in between 500,000 and 1 million?');
  printTable(await makeQuery(`
    SELECT name, population
    FROM city
    WHERE population
      BETWEEN 500000 AND 1000000
    ORDER BY population DESC
  `));

  console.log("\nWhat's the name of all the countries on the continent ‘Europe’?");
  printTable(await makeQuery(`
    SELECT name
    FROM country
    WHERE continent = 'Europe'
  `));

  console.log('\nList all the countries in the descending order of their surface areas.');
  printTable(await makeQuery(`
    SELECT name
    FROM country
    ORDER BY SurfaceArea DESC
  `));

  console.log('\nWhat are the names of all the cities in the Netherlands?');
  printTable(await makeQuery(`
    SELECT city.name AS name
    FROM city
    JOIN country
    ON city.countryCode = country.code
    WHERE country.name = 'Netherlands'
    ORDER BY name
  `));

  console.log('\nWhat is the population of Rotterdam?');
  printTable(await makeQuery(`
    SELECT name, population
    FROM city
    WHERE name = 'Rotterdam'
  `));

  console.log("\nWhat's the top 10 countries by Surface Area?");
  printTable(await makeQuery(`
    SELECT name
    FROM country
    ORDER BY SurfaceArea DESC
    LIMIT 10
  `));

  console.log("\nWhat's the top 10 most populated cities?");
  printTable(await makeQuery(`
    SELECT name, population
    FROM city
    ORDER BY Population DESC
    LIMIT 10
  `));

  console.log('\nWhat is the population number of the world?');
  printTable(await makeQuery(`
    SELECT SUM(population)
      AS world_population
    FROM country
  `));
}

queryDB(queryWorld);
