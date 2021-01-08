import { connection, printTable } from './mysql-connection.js';
/*
Insert some sample data in these tables. (write tr-insert-values.js file)
*/
const balances = [
  [101, 1000.00],
  [102, 100.00],
  [103, 525.64],
  [104, 2635.56],
  [105, 673.31],
];
const changes = [
  ['2020-12-29 17:59:59', 'Transfer from personal account'],
  ['2020-11-23 12:10:01', 'Cash deposit at ATM'],
  ['2020-12-17 14:34:16', 'Cash deposit at bank office'],
  ['2020-12-27 12:00:00', 'Payroll'],
  ['2020-11-05 20:00:34', 'Transfer from Celia Willis account'],
  // place the elements of balances array in front of each change
].map((change, i) => ([...balances[i], ...change]));

// is launched on each mySql query result
function output(_, result) {
  printTable(result);
}

connection.query('USE week3');
for (let i = 0; i < balances.length; i += 1) {
  connection.query(`
    INSERT INTO account
      (account_number, balance)
    VALUES (?, ?)
  `, balances[i], output);
  connection.query(`
    INSERT INTO account_changes
      (account_number, amount, changed_date, remark)
    VALUES (?, ?, ?, ?)
  `, changes[i], output);
}
connection.on('error', (error) => (console.error(error.message)));
connection.end();
