/* Write a JavaScript file (to be executed with Node.js) that queries (using select statements) the world database. The results given back should answer following questions: Don't omit to test your queries evey time. */
import { connection, makeQuery } from './mysql-connection.js';

async function queryWorld() {
  // show 'limit' number of lines from the result
  const output = async (query, limit = undefined) => {
    await makeQuery(`${query}${limit ? ` LIMIT ${limit}` : ''}`, true);
  }
  
  try {
    await makeQuery('USE world');

    console.log('\nWhat are the names of countries with population greater than 8 million?');
    await output('SELECT name FROM country WHERE population > 8000000 ORDER BY population DESC', 10);

    console.log('\nWhat are the names of countries that have “land” in their names?');
    await output("SELECT name FROM country WHERE name LIKE '%land%'");

    console.log('\nWhat are the names of the cities with population in between 500,000 and 1 million?');
    await output("SELECT name, population FROM city WHERE population BETWEEN 500000 AND 1000000 ORDER BY population DESC", 10);

    console.log("\nWhat's the name of all the countries on the continent ‘Europe’?");
    await output("SELECT name FROM country WHERE continent = 'Europe'");

    console.log('\nList all the countries in the descending order of their surface areas.');
    await output("SELECT name FROM country ORDER BY SurfaceArea DESC");

    console.log('\nWhat are the names of all the cities in the Netherlands?');
    await output("SELECT city.name AS name FROM city JOIN country ON (city.countryCode = country.code) WHERE country.name = 'Netherlands' ORDER BY name");

    console.log('\nWhat is the population of Rotterdam?');
    await output("SELECT name, population FROM city WHERE name = 'Rotterdam'");

    console.log("\nWhat's the top 10 countries by Surface Area?");
    await output("SELECT name FROM country ORDER BY SurfaceArea DESC", 10);

    console.log("\nWhat's the top 10 most populated cities?");
    await output("SELECT name, population FROM city ORDER BY Population DESC", 10);

    console.log('\nWhat is the population number of the world?');
    await output("SELECT SUM(population) AS WorldPopulation FROM country");
  } catch (error) {
    console.error(error.message);
  }
  connection.destroy();
}

queryWorld();
