/* Exercise 4 : MongoDB CRUD

Convert the MySQL world database into MongoDB either on your local machine or in the cloud Atlas.

    Write down all the steps of conversion (installation, commands etc.) in a text file / MD file.

    See 'ex4-sqlToMongoConversionSteps.md' for details
 */
import dotenv from 'dotenv';
import pkg from 'mongodb';
import path from 'path';
import csvtojson from 'csvtojson';
import colors from 'colors';
import { printTable } from './mysql-connection.js';

async function connectMongoDB(mongoClient) {
  try {
    await mongoClient.connect();
    await insertCity();
    await insertCountry();
    await insertCountryLanguage();
    await queryDutchCities();
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
}

/**
 * Helper function that reads CSV file with the 'name' from /mongodb folder,
 * creates corresponding JSON object and inserts this object into the 'world'
 * database of remote Mongo database
 * @param {string} name table name from the SQL World database and the
 * name of the corresponding CSV file
 * @param {object} params parameters describing the column names in CSV files.
 * Details can be found in the 'csvtojson' manual
 */
async function insertTable(name, params) {
  const csv = `${path.resolve()}/csv/${name}.csv`;
  const json = await csvtojson(params).fromFile(csv);
  const database = client.db('world');
  // is there a better way to check if collection already exists?
  if ((await database.listCollections().toArray()).some((coll) => coll.name === name)) {
    database.dropCollection(name);
  }
  const collection = database.collection(name);
  await collection.insertMany(json);
}

// Functions that read corresponding CSV files and put them
// into MongoDB Atlas

async function insertCity() {
  await insertTable('city', {
    noheader: true,
    headers: ['_id', 'Name', 'CountryCode', 'District', 'Population'],
    colParser: {
      _id: 'number',
      Name: 'string',
      CountryCode: 'string',
      District: 'string',
      Population: 'number',
    },
  });
}

async function insertCountry() {
  await insertTable('country', {
    noheader: true,
    headers: [
      'Code',
      'Name',
      'Continent',
      'Region',
      'SurfaceArea',
      'IndepYear',
      'Population',
      'LifeExpectancy',
      'GNP',
      'GNPOld',
      'LocalName',
      'GovernmentForm',
      'HeadOfState',
      'Capital',
      'Code2',
    ],
    colParser: {
      Code: 'string',
      Name: 'string',
      Continent: 'string',
      Region: 'string',
      SurfaceArea: 'number',
      IndepYear: 'number',
      Population: 'number',
      LifeExpectancy: 'number',
      GNP: 'number',
      GNPOld: 'number',
      LocalName: 'string',
      GovernmentForm: 'string',
      HeadOfState: 'string',
      Capital: 'number',
      Code2: 'string',
    },
  });
}

async function insertCountryLanguage() {
  await insertTable('countrylanguage', {
    noheader: true,
    headers: ['CountryCode', 'Language', 'IsOfficial', 'Percentage'],
    colParser: {
      CountryCode: 'string',
      Language: 'string',
      IsOfficial: 'string',
      Percentage: 'number',
    },
  });
}

/*
Write the following queries using MongoDB syntax in the JavaScript files.
*/
async function queryDutchCities() {
  const collection = client.db('world').collection('city');
  /*
  Create a new record (document) for a new city (your home town, say)
  */
  const city = {
    _id: 4080,
    Name: 'Nuenen',
    CountryCode: 'NLD',
    District: 'Noord-Brabant',
    Population: 0,
  };
  const { _id, Name, CountryCode } = city;
  await collection.insertOne(city);
  /*
  Update that record with a new population
  */
  await collection.updateOne({ _id }, { $set: { Population: 22438 } });
  /*
  Read the document that you just updated in two ways :
  finding by the city name,
  */
  console.log('\nThe village Nuenen:'.blue);
  printTable(await collection.findOne({ Name }));
  /*
  and then by the country code
  */
  console.log(colors.blue('\nCities in the Netherlands:'));
  printTable(await collection.find({ CountryCode }).toArray());
  /*
  Delete the city
  */
  await collection.deleteOne({ _id });
}

const { MongoClient } = pkg;

// connecting env constants with MongoDB login and password
dotenv.config();
const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;

// MongoDB connection URL
const url = `mongodb+srv://${user}:${pass}@aleks-shenshin.q0apz.mongodb.net/test?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true`;

const client = new MongoClient(url);

connectMongoDB(client);
