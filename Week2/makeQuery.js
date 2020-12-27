import util from 'util';
/**
 * Makes SQL query and returnes promise that resolves information from database
 * @param {*} connection MySQL connection
 * @param {string} query query string
 * @param {boolean} show whether to output resulting fields
 */
async function makeQuery(connection, query, show = false) {
  const execQuery = util.promisify(connection.query.bind(connection));
  try {
    const data = await execQuery(query);
    if (show) {
      console.log(data);
    }
  } catch (error) {
    console.error('Ошибка: ', error.message);
  }
  /* return new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) reject(error);
      let message = '';
      if (show) {
        if (fields[0].db && fields[0].table) {
          message += `Database: ${fields[0].db}, Table: ${fields[0].table}\n`;
        }
        message += results.map(result => Object.entries(result).map(([key, val]) => `${key}: ${val}`).join(', ')).join('\n');
      }
      resolve(message);
    });
  }); */
}

export default makeQuery;
