import { makeQuery, connection } from './mysql-connection.js';

async function queryDatabase() {
  await Promise.all([

    /*
    Exercise 1: Keys
    */

    'DROP DATABASE IF EXISTS week2',
    'CREATE DATABASE week2',
    'USE week2',
    /*
    Create a table, called Authors.
    Give it the following fields: (author_no(Primary Key), author_name, university, date_of_birth, h_index, gender)
    */
    `CREATE TABLE authors (
      author_no INT AUTO_INCREMENT PRIMARY KEY,
      author_name VARCHAR(255),
      university VARCHAR(255),
      date_of_birth DATE,
      h_index DECIMAL(19,2),
      gender VARCHAR(10)
    )`,
  ].map((q) => makeQuery(q)));
  /*
  Write a query that adds a foreign key column to Authors table that references the column author_no. Call this column Collaborator.
  */
  await Promise.all([
    'ALTER TABLE authors ADD collaborator INT',
    `ALTER TABLE authors
      ADD CONSTRAINT fk_collaborator 
      FOREIGN KEY  (collaborator)
      REFERENCES authors(author_no)`,
  ].map((q) => makeQuery(q)));

  /*
  Exercise 2: Relationships

  Create another table, called Research_Papers with the following fields: (paper_id, paper_title, conference, publish_date, ...)
 */
  await makeQuery(`
    CREATE TABLE research_papers (
      paper_id INT AUTO_INCREMENT PRIMARY KEY,
      paper_title TEXT,
      conference VARCHAR(255),
      publish_date DATETIME
    )
  `);

  /*
  What is the relationship between Authors and Research papers ? Make necessary changes to Authors and Research_Papers tables and add more tables if necessary.
  */

  // The relationship here is many-to-many because each author can have many research papers and each research paper can have many authors.
  // In order to deal with this situation I suggest creating a third table with authors' publications

  await makeQuery(`
    CREATE TABLE publications (
      publication_id INT AUTO_INCREMENT PRIMARY KEY,
      author_id INT,
      research_paper_id INT,

      CONSTRAINT fk_authors
      FOREIGN KEY (author_id)
      REFERENCES authors(author_no),

      CONSTRAINT fk_research_papers
      FOREIGN KEY (research_paper_id)
      REFERENCES research_papers(paper_id)
    )
  `);

  /*
  Read exercises 3 and 4 and then add information (insert rows) of 15 authors and 30 research papers such that all queries in the exercises 3 and 4 will return some answers
  */

  await makeQuery(`
    INSERT INTO research_papers (
      paper_title,
      conference,
      publish_date
    ) VALUES 
    ('A Field-Enhanced Conduction-Cooled Superconducting Cavity for High-Repetition-Rate Ultrafast Electron Bunch Generation', 'Accelerator Physics', '2020-12-24 18:44:55'),
    ('Reanalyses and a high-resolution model fail to capture the high tail of CAPE distributions', 'Atmospheric and Oceanic Physics', '2020-12-23 18:16:34'),
    ('Epidemic spreading', 'Biological Physics', '2020-12-22 18:01:26'),
    ('In Vitro Electron Density Refinement from Solution X-ray Scattering in the Wide-Angle Regime', 'Computational Physics', '2020-12-21 17:54:33'),
    ('Thermal performance of GaInSb quantum well lasers for silicon photonics applications', 'Optics', '2020-12-20 17:53:14'),
    ('Simple mathematical models for controlling COVID-19 transmission through social distancing and community awareness', 'Physics and Society', '2020-12-19 17:45:56'),
    ('A Topological Design Tool for the Synthesis of Antenna Radiation Patterns', 'Classical Physics', '2020-12-18 12:55:17')
  `);

  await makeQuery(`
    INSERT INTO authors (
      author_name,
      university,
      date_of_birth,
      h_index,
      gender
    ) VALUES 
    ('Johnny Bishop', 'Gosagruj', '1955-12-14', 10.1, 'male'),
    ('Verna Schneider', 'Rowviib', '1964-01-08', 9.4, 'undecided'),
    ('Walter Phelps', 'Vazjubsez', '1976-11-23', 8.2, 'male'),
    ('Flora Dunn', 'Vuapbu', '1990-08-17', 3.4, 'female'),
    ('Ethan Collins', 'Opcizij', '1995-01-12', 2.8, 'undecided'),
    ('Harvey Fox', 'Embedut', '1985-09-03', 4.5, 'neutral')
  `);

  await makeQuery(`
    INSERT INTO publications (
      author_id, research_paper_id
    ) VALUES
      (1, 1), (2, 1), (3, 1),
      (4, 2), (5, 2), (6, 2)
  `);

  /*
  Exercise 3: Joins

  Write a query that prints names of all Authors and their corresponding Collaborators.
  */
  /*
SELECT r.paper_title, a.author_name  FROM authors a JOIN publications p JOIN research_papers r
    ON a.author_no = p.author_id AND r.paper_id = p.research_paper_id
*/

  // await makeQuery('SELECT * FROM publications', true);
  // await makeQuery('DESCRIBE publications', true);
  connection.destroy();
}

queryDatabase();
