const { MongoClient } = require("mongodb")
require('dotenv').config()

const mongoClient = new MongoClient(process.env.MONGODB_URI)
const connection = mongoClient.connect()

exports.handler = async () => { 
  try {
    const database = (await connection).db(process.env.MONGODB_DATABASE)
    const collection = database.collection(
      process.env.MONGODB_COLLECTION_MOVIES
    )
    //FIXME add pagination support
    const data = await collection.find({}).limit(10).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: error.toString()
    }
  }
 }

