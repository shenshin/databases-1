import { queryDB, makeQuery, insertArray } from './mysql-connection.js';
/*
Insert some sample data in these tables. (write tr-insert-values.js file)
*/
queryDB(async () => {
  await makeQuery('USE week3');
  const balances = [
    [101, 1000.00],
    [102, 100.00],
    [103, 525.64],
    [104, 2635.56],
    [105, 673.31],
  ];
  await insertArray(
    balances,
    `INSERT INTO account (account_number, balance)
    VALUES (?)`,
  );
  const changes = [
    [101, balances[0][1], '2020-12-29 17:59:59', 'Transfer from personal account'],
    [102, balances[1][1], '2020-11-23 12:10:01', 'Cash deposit at ATM'],
    [103, balances[2][1], '2020-12-17 14:34:16', 'Cash deposit at bank office'],
    [104, balances[3][1], '2020-12-27 12:00:00', 'Payroll'],
    [105, balances[4][1], '2020-11-05 20:00:34', 'Transfer from Celia Willis account'],
  ];
  await insertArray(
    changes,
    `INSERT INTO account_changes
    (account_number, amount, changed_date, remark)
    VALUES (?)`,
  );
});
