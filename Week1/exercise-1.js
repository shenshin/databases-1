/* Write a JavaScript file (to be executed with Node.js) that creates and makes a connection to a MySQL database. Do so using the mysql package (https://www.npmjs.com/package/mysql). */
import { connection as con, makeQuery, printTable } from './mysql-connection.js';

function createMeetings() {
  [
    'DROP DATABASE IF EXISTS meetup',
    /*
    Create a database called meetup
    */
    'CREATE DATABASE meetup',
    'USE meetup',
    /*
    Create a table called Invitee with the following fields
    (invitee_no, invitee_name and invited_by).
    */
    `CREATE TABLE invitee (
      invitee_no INT,
      invitee_name VARCHAR(255),
      invited_by VARCHAR(255)
    )`,
    /*
    Create a table called Room with the following fields (room_no, room_name and floor_number)
    */
    `CREATE TABLE room (
      room_no INT,
      room_name VARCHAR(255),
      floor_number INT
    )`,
    /*
    Create a table called Meeting with the following fields
    (meeting_no, meeting_title, starting_time, ending_time,room_no)
    */
    `CREATE TABLE meeting (
      meeting_no INT,
      meeting_title VARCHAR(255),
      starting_time DATETIME
    )`,
  ].forEach((query) => con.query(query));
}

function insertMeetings() {
  /* Insert 5 rows into each table with relevant fields.Find a way
  to create the data for those fields */

  // invitees
  [
    [1, 'Alex', 'Luna'],
    [4, 'Leo', 'Luna'],
    [6, 'Sara', 'Jane'],
    [34, 'Oracle', 'Morpheus'],
    [7, 'Neo', 'Agent Smith'],
  ].forEach((invitee) => {
    con.query(`
      INSERT INTO invitee
        (invitee_no, invitee_name, invited_by)
      VALUES (?, ?, ?)
    `, invitee);
  });

  // rooms
  [
    [345, 'Room 345', 3],
    [937, 'Penthouse 7', 9],
    [254, 'Room 254', 2],
    [103, 'Room 103', 1],
    [259, 'Room 259', 2],
  ].forEach((room) => {
    con.query(`
      INSERT INTO room
        (room_no, room_name, floor_number)
      VALUES (?, ?, ?)
    `, room);
  });

  // meetings
  [
    [2, 'Conversation', '2021-01-20 10:00:00'],
    [5, 'Negotiation', '2021-01-21 14:10:00'],
    [3, 'Discussion', '2021-01-22 18:30:00'],
    [1, 'Palaver', '2021-01-23 23:00:00'],
    [7, 'Compleet waste of time', '2021-01-24 16:45:00'],
  ].forEach((meeting) => {
    con.query(`
      INSERT INTO meeting
        (meeting_no, meeting_title, starting_time)
      VALUES (?, ?, ?)
    `, meeting);
  });
}

async function selectQueries() {
  const tables = ['invitee', 'room', 'meeting'];
  const promises = tables
    .map((name) => `SELECT * FROM ${name}`)
    .map((query) => makeQuery(query));
  try {
    const results = await Promise.all(promises);
    results.forEach((result, i) => {
      console.log(tables[i]);
      printTable(result);
    });
  // catching errors in promises
  } catch (error) {
    console.error(error.message);
  }
}
// catching mySql errors
con.on('error', (error) => {
  console.error(error.message);
});
createMeetings();
insertMeetings();
selectQueries();
con.end();
