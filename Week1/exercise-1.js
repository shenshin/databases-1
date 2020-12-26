import mysql from 'mysql';
import makeQuery from './makeQuery.js';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  charset: 'utf8',
});

const creationQueries = [
  'CREATE DATABASE IF NOT EXISTS meetup;',
  'USE meetup;',
  `CREATE TABLE IF NOT EXISTS Invitee (
    invitee_no INT,
    invitee_name TEXT,
    invited_by TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS Room (
    room_no INT,
    room_name TEXT,
    floor_number INT
  );`,
  `CREATE TABLE IF NOT EXISTS Meeting (
    meeting_no INT,
    meeting_title TEXT,
    starting_time TIME
  );`,
  `INSERT INTO Invitee (invitee_no, invitee_name, invited_by)
  VALUES
  (1, 'Alex', 'Luna'),
  (4, 'Leo', 'Luna'),
  (6, 'Sara', 'Jane'),
  (34, 'Oracle', 'Morpheus'),
  (7, 'Neo', 'Agent Smith')`,
  `INSERT INTO Room (room_no, room_name, floor_number)
  VALUES
  (345, 'Room 345', 3),
  (937, 'Penthouse 7', 9),
  (254, 'Room 254', 2),
  (103, 'Room 103', 1),
  (259, 'Room 259', 2)`,
  `INSERT INTO Meeting (meeting_no, meeting_title, starting_time)
  VALUES
  (2, 'Conversation', '10:00:00'),
  (5, 'Negotiation', '14:10:00'),
  (3, 'Discussion', '18:30:00'),
  (1, 'Palaver', '23:00:00'),
  (7, 'Compleet waste of time', '16:45:00')`,
];

creationQueries.forEach((query) => makeQuery(connection, query));
['Invitee', 'Room', 'Meeting']
  .map(name => `SELECT * FROM ${name}`)
  .forEach(query => makeQuery(connection, query, true));
makeQuery(connection, 'DROP DATABASE meetup;');
connection.end(() => console.log('Closing connection'));