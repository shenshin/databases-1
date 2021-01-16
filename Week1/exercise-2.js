/*
  Write a JavaScript file (to be executed with Node.js) that queries
 (using select statements) the world database. The results given back
 should answer following questions: Don't omit to test your queries evey
  time.
*/
import colors from 'colors';
import { connection, printTable } from './mysql-connection.js';

function printResult(title, result) {
  console.log(colors.blue(`\n${title}`));
  printTable(result);
}

function queryWorld() {
  connection.query('USE world');

  connection.query(`
    SELECT name
    FROM country
    WHERE population > 8000000
    ORDER BY population DESC
  `, (err, res) => printResult(
    'What are the names of countries with population greater than 8 million?', res,
  ));

  connection.query(`
    SELECT name
    FROM country
    WHERE name
      LIKE '%land%'
  `, (err, res) => printResult(
    'What are the names of countries that have “land” in their names?', res,
  ));

  connection.query(`
    SELECT name, population
    FROM city
    WHERE population
      BETWEEN 500000 AND 1000000
    ORDER BY population DESC
  `, (err, res) => printResult(
    'What are the names of the cities with population in between 500,000 and 1 million?', res,
  ));

  connection.query(`
    SELECT name
    FROM country
    WHERE continent = 'Europe'
  `, (err, res) => printResult(
    "What's the name of all the countries on the continent ‘Europe’?", res,
  ));

  connection.query(`
    SELECT name
    FROM country
    ORDER BY SurfaceArea DESC
  `, (err, res) => printResult(
    'List all the countries in the descending order of their surface areas.', res,
  ));

  connection.query(`
    SELECT city.name AS name
    FROM city
    JOIN country
    ON city.countryCode = country.code
    WHERE country.name = 'Netherlands'
    ORDER BY name
  `, (err, res) => printResult(
    'What are the names of all the cities in the Netherlands?', res,
  ));

  connection.query(`
    SELECT name, population
    FROM city
    WHERE name = 'Rotterdam'
  `, (err, res) => printResult(
    'What is the population of Rotterdam?', res,
  ));

  connection.query(`
    SELECT name
    FROM country
    ORDER BY SurfaceArea DESC
    LIMIT 10
  `, (err, res) => printResult(
    "What's the top 10 countries by Surface Area?", res,
  ));

  connection.query(`
    SELECT name, population
    FROM city
    ORDER BY Population DESC
    LIMIT 10
  `, (err, res) => printResult(
    "What's the top 10 most populated cities?", res,
  ));

  connection.query(`
    SELECT SUM(population)
      AS world_population
    FROM country
  `, (err, res) => printResult(
    'What is the population number of the world?', res,
  ));
}

connection.on('error', (error) => {
  console.error(error.message);
});
queryWorld();
connection.end();
