import colors from 'colors';
import {
  connection, makeQuery, insertArray, printTable,
} from './mysql-connection.js';

/*
Transfer the amount of 1000 from account number 101 to account number 102
and log the changes in the table account_changes. Do this in a single
transaction (Write transaction.js file)
*/

async function makeTransfer(fromAccount, toAccount, amount) {
  // prints tables to console
  const showTables = async () => {
    console.log('Accounts'.blue);
    printTable(await makeQuery('SELECT * from account'));
    console.log('Account Changes'.blue);
    printTable(await makeQuery('SELECT * from account_changes'));
  };

  // transaction date and time
  const dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  // transaction comment
  const remark = `Transfer the amount of ${amount} from account ${fromAccount} to ${toAccount}`;
  // find balance of an account with the number 'accountNumber'
  const getBalance = async (accountNumber) => {
    const { balance } = (await makeQuery(`
      SELECT balance
      FROM account
      WHERE account_number = ?
    `, [accountNumber]))[0];
    return balance;
  };
  connection.query('USE week3');
  connection.query('START TRANSACTION');
  try {
    console.log('Tables before transfer'.yellow);
    await showTables();
    // checking the balances of the accounts involved
    const fromBalance = await getBalance(fromAccount);
    const toBalance = await getBalance(toAccount);
    if (amount > fromBalance) {
      throw new Error('Insufficient funds');
    }
    // register accounts changes
    const accountChanges = [
      [fromAccount, -amount, dateTime, remark],
      [toAccount, amount, dateTime, remark],
    ];
    await insertArray(accountChanges, `
      INSERT INTO account_changes
      (account_number, amount, changed_date, remark)
      VALUES (?)
    `);

    // update accounts ballances
    const updateQuery = `
      UPDATE account
      SET balance = ?
      WHERE account_number = ?
    `;
    await makeQuery(updateQuery, [fromBalance - amount, fromAccount]);
    await makeQuery(updateQuery, [toBalance + amount, toAccount]);

    await makeQuery('COMMIT');

    console.log('Tables after transfer'.yellow);
    await showTables();
  } catch (error) {
    console.log(colors.red.inverse(error.message));
    connection.query('ROLLBACK');
  } finally {
    connection.end();
  }
}
/*
Transfer the amount of 1000 from account number 101 to account number 102
*/
makeTransfer(101, 102, 1000);
