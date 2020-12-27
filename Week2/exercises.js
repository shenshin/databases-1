import { makeQuery, connection } from './mysql-connection.js';

async function queryDatabase() {
  await Promise.all([

    // Exercise 1: Keys

    'DROP DATABASE IF EXISTS week2;',
    'CREATE DATABASE week2;',
    'USE week2;',
    // Create a table, called Authors.
    // Give it the following fields: (author_no(Primary Key), author_name, university, date_of_birth, h_index, gender)
    `CREATE TABLE authors (
      author_no INT AUTO_INCREMENT PRIMARY KEY,
      author_name VARCHAR(255),
      university VARCHAR(255),
      date_of_birth DATE,
      h_index DECIMAL(2,1),
      gender VARCHAR(10)
    );`,
  ].map((q) => makeQuery(q)));
  // Write a query that adds a foreign key column to Authors table that references the column author_no. Call this column Collaborator.
  await Promise.all([
    'ALTER TABLE authors ADD collaborator INT;',
    `ALTER TABLE authors
      ADD CONSTRAINT fk_collaborator 
      FOREIGN KEY  (collaborator)
      REFERENCES authors(author_no);`,
  ].map((q) => makeQuery(q)));

  // Exercise 2: Relationships

  // Create another table, called Research_Papers with the following fields: (paper_id, paper_title, conference, publish_date, ...)

  await makeQuery(`
    CREATE TABLE research_papers (
      paper_id INT AUTO_INCREMENT PRIMARY KEY,
      paper_title VARCHAR(255),
      conference VARCHAR(255),
      publish_date DATE
    );
  `);

  await makeQuery(`
    INSERT INTO authors(
      author_name,
      university,
      date_of_birth,
      h_index,
      gender) VALUES 
      ('Johnny Bishop', 'Gosagruj', 1955-12-14, 10.1, 'm'),
      ('Verna Schneider', 'Rowviib', 1964-01-08, 9.4, 'f'),
      ('Walter Phelps', 'Vazjubsez', 1976-11-23, 8.2, 'm');
  `);

  await makeQuery('SELECT * FROM authors;', true);
  connection.destroy();
}

queryDatabase();
