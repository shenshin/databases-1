/**
 * Makes SQL query and prints result to the console
 * @param {*} connection MySQL connection
 * @param {string} query query string
 * @param {boolean} show whether to print result to the console
 */
function makeQuery(connection, query, show = false) {
  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    if (show) {
      if (fields) {
        console.log(`Database: ${fields[0].db}, Table: ${fields[0].table}`);
      }
      results.forEach(result => {
        console.log(Object.entries(result).map(([key, val]) => `${key}: ${val}`).join(', '));
      });
      console.log('');
    }
  });
}

export default makeQuery;
