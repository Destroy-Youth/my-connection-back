const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()

const mongoClient = new MongoClient(process.env.MONGODB_URI)
const connection = mongoClient.connect()

exports.handler = async (event, context) => {
  try {
    const database = (await connection).db(process.env.MONGODB_DATABASE)
    const collection = database.collection(
      process.env.MONGODB_COLLECTION_COMMENTS
    )

    const { movieId } = event.queryStringParameters
    const data = await collection
      .find({ movie_id: new ObjectId(movieId) })
      .toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: error.toString(),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    }
  }
}
