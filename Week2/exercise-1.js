import { makeQuery, connection } from './mysql-connection.js';

async function queryDatabase() {
  const requests = [
    'CREATE DATABASE week2;',
    'USE week2',
    'CREATE TABLE authors;',
    'DROP DATABASE week2;',
  ];
  await Promise.all(requests.map((r) => makeQuery(r)));
  connection.destroy();
}

queryDatabase();
