import { MongoClient, Db } from 'mongodb'
import keys from '../config/keys'
export let mongoClient : MongoClient
export let database : Db

export async function setupDatabase() {
    mongoClient = new MongoClient(keys.mongodb.dbURI, { useNewUrlParser: true })
    await mongoClient.connect()
    database = mongoClient.db('core')
    console.log("Connected to database!")
}
