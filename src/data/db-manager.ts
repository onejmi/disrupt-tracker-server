import { MongoClient, Db } from 'mongodb'
import keys from '../config/keys'
import { UserCollection } from './collections/users'
export let mongoClient : MongoClient
export let database : Db


export async function setupDatabase() {
    mongoClient = new MongoClient(keys.mongodb.dbURI, { useNewUrlParser: true })
    await mongoClient.connect()
    database = mongoClient.db('core')
    initCollections()
    console.log("Connected to database!")
}

function initCollections() {
    UserCollection.init()
}
