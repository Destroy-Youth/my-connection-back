const { MongoClient, ObjectId } = require('mongodb')
const moment = require('moment')
const { baseHeaders } = require('../../../constants')
require('dotenv').config()

const mongoClient = new MongoClient(process.env.MONGODB_URI)
const connection = mongoClient.connect()

exports.handler = async (event, context) => {
  if (event.httpMethod == 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTION',
      },
    }
  }

  if (event.httpMethod != 'POST') {
    return {
      statusCode: 405,
    }
  }

  try {
    const database = (await connection).db(process.env.MONGODB_DATABASE)

    const { movieId, userId, text } = JSON.parse(event.body)

    // get user data
    const usersCollection = database.collection(
      process.env.MONGODB_COLLECTION_USERS
    )
    let user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    })

    // check if movie exists
    const movie = await database
      .collection(process.env.MONGODB_COLLECTION_MOVIES)
      .findOne({ _id: new ObjectId(movieId) })

    // get comments and add the new one
    const result = await database
      .collection(process.env.MONGODB_COLLECTION_COMMENTS)
      .insertOne({
        name: user.name,
        email: user.email,
        movie_id: new ObjectId(movieId),
        text,
        date: moment(new Date()).format(),
      })

    console.log(result)

    return {
      statusCode: 201,
      headers: baseHeaders,
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: error.toString(),
      headers: baseHeaders,
    }
  }
}
