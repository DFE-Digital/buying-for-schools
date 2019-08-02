const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(process.env.S107D01_MONGO_01_READONLY, { useNewUrlParser: true })
const collections = {}
client.connect()
  .then(() => client.db('s107d01-mongo-01'))
  .then(db => collections.structures = db.collection('structures'))

module.exports = collections