/* Write a JavaScript file (to be executed with Node.js) that creates and makes a connection to a MySQL database. Do so using the mysql package (https://www.npmjs.com/package/mysql). */
import { connection, makeQuery } from './mysql-connection.js';

const creationQueries = [
  'DROP DATABASE IF EXISTS meetup',
  // Create a database called meetup
  'CREATE DATABASE IF NOT EXISTS meetup',
  'USE meetup',
  // Create a table called Invitee with the following fields (invitee_no, invitee_name and invited_by).
  `CREATE TABLE IF NOT EXISTS invitee (
    invitee_no INT,
    invitee_name TEXT,
    invited_by TEXT
  )`,
  // Create a table called Room with the following fields (room_no, room_name and floor_number)
  `CREATE TABLE IF NOT EXISTS room (
    room_no INT,
    room_name TEXT,
    floor_number INT
  )`,
  // Create a table called Meeting with the following fields (meeting_no, meeting_title, starting_time, ending_time,room_no)
  `CREATE TABLE IF NOT EXISTS meeting (
    meeting_no INT,
    meeting_title TEXT,
    starting_time TIME
  )`,
  // Insert 5 rows into each table with relevant fields. Find a way to create the data for those fields
  `INSERT INTO invitee (invitee_no, invitee_name, invited_by)
  VALUES
  (1, 'Alex', 'Luna'),
  (4, 'Leo', 'Luna'),
  (6, 'Sara', 'Jane'),
  (34, 'Oracle', 'Morpheus'),
  (7, 'Neo', 'Agent Smith')`,
  `INSERT INTO room (room_no, room_name, floor_number)
  VALUES
  (345, 'Room 345', 3),
  (937, 'Penthouse 7', 9),
  (254, 'Room 254', 2),
  (103, 'Room 103', 1),
  (259, 'Room 259', 2)`,
  `INSERT INTO meeting (meeting_no, meeting_title, starting_time)
  VALUES
  (2, 'Conversation', '10:00:00'),
  (5, 'Negotiation', '14:10:00'),
  (3, 'Discussion', '18:30:00'),
  (1, 'Palaver', '23:00:00'),
  (7, 'Compleet waste of time', '16:45:00')`,
];

async function arrangeMeetings() {
  const creationPromises = creationQueries.map(query => makeQuery(query));

  const selectionPromises = ['invitee', 'room', 'meeting']
  .map(name => `SELECT * FROM ${name}`)
  .map(query => makeQuery(query, true));

  try {
    await Promise.all([...creationPromises, ...selectionPromises]);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
  
  connection.destroy();
}

arrangeMeetings();
