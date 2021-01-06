# Steps to convert MySQL 'World' database to MongoDB

In order to convert city, country and countrylanguage tables I followed [databases week-3 reading material](https://github.com/HackYourFuture/databases/tree/master/Week3) in the paragraph 'Preparing you for the homework':
- In SQL console I converted tables into 3 SVC files: city.svc, country.svc, countrylanguage.svc using the following commands:
```sql
select * into outfile 'city.csv' FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' from city;
select * into outfile 'country.csv' FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' from country;
select * into outfile 'countrylanguage.csv' FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' from countrylanguage;
```

- I put those files into ./csv/ folder of week3 homework project folder
- I created a MongoDB Atlas account following [the official documentation](https://docs.atlas.mongodb.com/getting-started)

To convert CSV to JSON I used ['csvtojson' module](https://www.npmjs.com/package/csvtojson)

- I installed 'csvtojson' and 'mongodb' modules to the week3 project and imported them inside 'ex4-mongoConnection.js' 
- In that file I created helper function insertTable(name, params) that does all the job: it reads csv file with appropriate name, creates JSON out of it, connects to MongoDB, creates tables and puts JSON there.

The rest you can see in 'ex4-mongoConnection.js'