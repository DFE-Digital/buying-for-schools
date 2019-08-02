const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(process.env.S107D01_MONGO_01_READONLY, { useNewUrlParser: true })
const db = {}
client.connect()
  .then(() => client.db('s107d01-mongo-01'))
  .then(connection => db.structures = connection.collection('structures'))
  .then(() => console.log('connection made'))

db.getRecord = (status) => {
  return db.structures.findOne({ status }, { sort: { updatedAt: -1 } })
}

db.populateFramework = (doc, f) => {
  const modifiedFramework = { ...f }
  modifiedFramework.provider = doc.provider.find(p => p._id.toString() === f.provider.toString())
  modifiedFramework.cat = doc.category.find(c => c._id.toString() === f.cat.toString())
  return modifiedFramework
}

module.exports = db
