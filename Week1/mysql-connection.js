import mysql from 'mysql';
import util from 'util';
/* Make a connection to your database, using your MySQL hyfuser login credentials */
export const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  charset: 'utf8',
});

const execQuery = util.promisify(connection.query.bind(connection));

export async function makeQuery(query, show = false) {
  try {
    const queryResult = await execQuery(query);
    if (show) {
      const table = queryResult.map((rowDataPacket) => 
        Object.entries(rowDataPacket)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')
      );
      console.log(table);
    }
  } catch (error) {
    console.error(error.message);
  }
}
