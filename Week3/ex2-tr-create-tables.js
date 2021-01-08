import { connection, printTable } from './mysql-connection.js';

/*
Exercise 2 : Transactions
    1. Create two tables account and account_changes (write tr-create-tables.js file)
*/

[
  'DROP DATABASE IF EXISTS week3',
  'CREATE DATABASE week3',
  'USE week3',
  /*
    2. account table should have following fields : account_number, balance.
    */
  `CREATE TABLE account (
      account_number INT PRIMARY KEY,
      balance DECIMAL(10,2)
    )`,
  /*
    3. account_changes table should the the following fields :
    change_number, account_number, amount, changed_date, remark.
    4. Choose the appropriate data types, keys for these tables.
    */
  `CREATE TABLE account_changes (
      change_number INT AUTO_INCREMENT PRIMARY KEY,
      account_number INT NOT NULL,
      amount DECIMAL(10,2),
      changed_date DATETIME,
      remark TEXT,
      CONSTRAINT fk_account
      FOREIGN KEY (account_number)
      REFERENCES account(account_number)
    )`,
].forEach((query) => {
  connection.query(query, (_, result) => {
    printTable(result);
  });
});
connection.on('error', (error) => (console.error(error.message)));
connection.on('end', () => (console.info('Tot ziens!')));
connection.end();
