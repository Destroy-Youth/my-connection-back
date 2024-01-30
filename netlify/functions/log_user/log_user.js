const { MongoClient } = require('mongodb')
const { baseHeaders } = require('../../../constants')
require('dotenv').config()

const mongoClient = new MongoClient(process.env.MONGODB_URI)
const connection = mongoClient.connect()

exports.handler = async (event, context) => {
  if (event.httpMethod == 'OPTIONS') {
    console.log('IF OPTIONS')

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTION',
      },
    }
  }

  try {
    const database = (await connection).db(process.env.MONGODB_DATABASE)
    const usersCollection = database.collection(
      process.env.MONGODB_COLLECTION_USERS
    )
    const { email, password } = JSON.parse(event.body)
    const user = await usersCollection.findOne({ email, password })

    //FIXME replace hardcode for constants
    if (!user) {
      return {
        statusCode: 403,
        body: 'You shall not pass!!!',
        headers: baseHeaders,
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(user),
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
