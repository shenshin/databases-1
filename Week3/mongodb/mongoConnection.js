import pkg from 'mongodb';

const { MongoClient } = pkg;

const url = 'mongodb+srv://aleks:acxsfh@aleks-shenshin.q0apz.mongodb.net/test?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true';

const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    const collection = client.db('proshop').collection('products');
    // perform actions on the collection object
    console.log(collection);
    // console.log('Connected correctly to server');
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

// const MONGO_URI = 'mongodb+srv://aleks:acxsfh@aleks-shenshin.q0apz.mongodb.net/proshop?retryWrites=true&w=majority';

// const uri = 'mongodb+srv://aleks:<password>@aleks-shenshin.q0apz.mongodb.net/<dbname>?retryWrites=true&w=majority';
/* const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
try {
  client.connect((err) => {
    if (err) throw new Error(err.errmsg);
    const collection = client.db('proshop').collection('products');
    // perform actions on the collection object
    console.log('MongoDB: ', collection);
    client.close();
  });
} catch (error) {
  console.error(error.message);
} */
