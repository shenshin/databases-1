import colors from 'colors';
import {
  makeQuery, connection as con, printTable,
} from './mysql-connection.js';

function keys() {
  [
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
      gender VARCHAR(1)
    )`,

    /*
    Write a query that adds a foreign key column to Authors table that references the column author_no. Call this column Collaborator.
    */

    `ALTER TABLE authors
      ADD collaborator INT`,
    `ALTER TABLE authors
      ADD CONSTRAINT fk_collaborator 
      FOREIGN KEY  (collaborator)
      REFERENCES authors(author_no)`,
  ].map((q) => con.query(q));
}

function relationShips() {
  /*
    Exercise 2: Relationships

    Create another table, called Research_Papers with the following fields: (paper_id, paper_title, conference, publish_date, ...)
   */
  con.query(`
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

  con.query(`
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
  const researchPapersDetails = [
    ['A Field-Enhanced Conduction-Cooled Superconducting Cavity for High-Repetition-Rate Ultrafast Electron Bunch Generation', 'Accelerator Physics', '2020-12-24 18:44:55'],
    ['Reanalyses and a high-resolution model fail to capture the high tail of CAPE distributions', 'Atmospheric and Oceanic Physics', '2020-12-23 18:16:34'],
    ['Epidemic spreading', 'Biological Physics', '2020-12-22 18:01:26'],
    ['In Vitro Electron Density Refinement from Solution X-ray Scattering in the Wide-Angle Regime', 'Computational Physics', '2020-12-21 17:54:33'],
    ['Thermal performance of GaInSb quantum well lasers for silicon photonics applications', 'Optics', '2020-12-20 17:53:14'],
    ['Simple mathematical models for controlling COVID-19 transmission through social distancing and community awareness', 'Physics and Society', '2020-12-19 17:45:56'],
    ['A Topological Design Tool for the Synthesis of Antenna Radiation Patterns', 'Classical Physics', '2020-12-18 12:55:17'],
  ];
  researchPapersDetails.forEach((row) => {
    con.query(`
      INSERT INTO research_papers (
        paper_title,
        conference,
        publish_date
      ) VALUES (?, ?, ?)
    `, row);
  });

  const authorsDetails = [
    ['Johnny Bishop', 'Gosagruj', '1955-12-14', 10.1, 'm'],
    ['Verna Schneider', 'Rowviib', '1964-01-08', 9.4, 'u'],
    ['Walter Phelps', 'Gosagruj', '1976-11-23', 8.2, 'm'],
    ['Flora Dunn', 'Rowviib', '1990-08-17', 3.4, 'f'],
    ['Ethan Collins', 'Gosagruj', '1995-01-12', 2.8, 'u'],
    ['Harvey Fox', 'Suhennos', '1985-09-03', 4.5, 'n'],
    ['Shane Summers', 'Rowviib', '1991-11-30', 9.1, 'w'],
    ['Caroline Simpson', 'Suhennos', '1969-10-09', 4.2, 'f'],
  ];
  authorsDetails.forEach((row) => {
    con.query(`
      INSERT INTO authors (
        author_name,
        university,
        date_of_birth,
        h_index,
        gender
      ) VALUES (?, ?, ?, ?, ?)
    `, row);
  });

  // Add conrtibutors to the users
  const contributors = [
    [1, 2],
    [2, 1],
    [3, 6],
    [4, 5],
    [5, 4],
    [6, 3],
  ];
  contributors.forEach((row) => {
    con.query(`
      UPDATE authors
      SET collaborator = ?
      WHERE
      author_no = ?
    `, row);
  });

  // here I connect the specific author with an article:
  // each author may collaborate in many different articles,
  // each article is written by many authors
  const publicationsDetails = [
    [1, 1], // - author 1 collaborates in article 1
    [2, 1], // author 2 collaborates in article 1
    [3, 1], // author 3 collaborates in article 1 etc
    [4, 2], [5, 2], [6, 2], [1, 7], [2, 7], [3, 7],
    [1, 6], [2, 6], [3, 6], [8, 6], [8, 5],
  ];
  // Thus, this schema unequivocally defines ALL collaborators
  // of each author and there is no need to use
  // foreign key 'fk_collaborator' that was added in exercise 1.
  // Am I right?
  publicationsDetails.forEach((row) => {
    con.query(`
      INSERT INTO publications (
        author_id, research_paper_id
      ) VALUES (?, ?)
    `, row);
  });
}

async function joins() {
  /*
    Exercise 3: Joins

    Write a query that prints names of all Authors and their corresponding Collaborators.
    */
  console.log('\nAll authors and their corresponding Collaborators'.blue);
  printTable(await makeQuery(`
    SELECT
      a.author_name,
      c.author_name AS collaborator_name
    FROM authors a
    LEFT JOIN authors c
    ON a.author_no = c.collaborator
  `));

  // Also I may want to get all collaborabors by exploring all papers by current author and then
  // searching who of the rest authors collaborated the same paper.
  // For that purpose I may need two data sets:
  const authors = await makeQuery('SELECT author_no, author_name FROM authors');
  const publicationsByAuthor = await makeQuery('SELECT author_id, research_paper_id FROM publications');

  // The following code outputs for each athor all his collegues tho contributed to the same papers.

  const collaboratorsByAuthor = authors.map((currentAuthor) => {
    // find all publications written by the current author
    const currentUserPublications = (publicationsByAuthor.filter((publication) => currentAuthor.author_no === publication.author_id)).map((row) => row.research_paper_id);
    // find the names of all other authors (except current) that contributed to the same publications
    const authorsWithSamePublications = [...new Set(publicationsByAuthor.filter((publication) => publication.author_id !== currentAuthor.author_no && currentUserPublications.includes(publication.research_paper_id)).map((row) => row.author_id))].map((authorID) => authors.find((author) => authorID === author.author_no).author_name);
    return {
      author_name: currentAuthor.author_name,
      authorsWithSamePublications,
    };
  });
  console.log('\nAll Authors and ALL their collegues who contributed to the same publications'.blue);
  console.log(collaboratorsByAuthor);

  /*
    Write a query that prints all columns of Authors and their pubished paper_title. If there is an author without any Research_Papers, print the information of that Author too.
  */
  console.log('\nAll columns of Authors and their published paper_title'.blue);
  printTable(await makeQuery(`
      SELECT a.*, r.paper_title
      FROM authors a 
      LEFT JOIN publications p
      ON a.author_no = p.author_id
      LEFT JOIN research_papers r
      ON p.research_paper_id = r.paper_id
    `));
}

async function aggregate() {
  /*
    Exercise 4: Aggregate Functions

    Write some queries to retrieve the following rows:

    All research papers and the number of authors that wrote that paper.

    */
  console.log('\nAll research papers and the number of authors that wrote that paper.'.blue);
  printTable(await makeQuery(`
     SELECT r.paper_title AS title, 
     COUNT(DISTINCT p.author_id)
     AS number_of_authors
     FROM research_papers r
     LEFT JOIN publications p
     ON r.paper_id = p.research_paper_id
     GROUP BY r.paper_id
   `));
  /*
   Sum of the research papers published by all female authors
   */
  console.log('\nSum of the research papers published by all female authors'.blue);
  printTable(await makeQuery(`
     SELECT a.author_name AS female_author,
     COUNT(p.publication_id) AS number_of_papers
     FROM authors a
     LEFT JOIN publications p
     ON a.author_no = p.author_id
     WHERE a.gender = 'f'
     GROUP BY a.author_no
   `));
  /*
   Average of the h-index of all authors per university.
   */
  console.log('\nAverage of the h-index of all authors per university.'.blue);
  printTable(await makeQuery(`
     SELECT university,
     AVG(h_index) AS average_h_index
     FROM authors
     GROUP BY university
  `));
  /*
   Sum of the research papers of the authors per university.
   */
  console.log('\nSum of the research papers of the authors per university.'.blue);
  printTable(await makeQuery(`
     SELECT a.university,
     COUNT(p.publication_id) AS number_of_papers
     FROM authors a
     LEFT JOIN publications p
     ON a.author_no = p.author_id
     GROUP BY a.university
   `));
  /*
   Minimum and maximum of the h-index of all authors per university..
   */
  console.log('\nMinimum and maximum of the h-index of all authors per university'.blue);
  printTable(await makeQuery(`
     SELECT university,
     MIN(h_index) AS min_h_index,
     MAX(h_index) AS max_h_index
     FROM authors
     GROUP BY university
  `));
}

// function calls

con.on('error', (error) => {
  console.error(colors.red.inverse(error.message));
});
keys();
relationShips();

(async function tryQuery() {
  try {
    await joins();
    await aggregate();
  } catch (error) {
    process.stdout.write(colors.red.inverse(error.message));
  } finally {
    con.end();
  }
}());
