import mongoose from 'mongoose'
import { config } from '../config'

export default async () => {
    const options = {}
    const connection = await mongoose.connect(config.mongoDB.uri, options)
    return connection.connection.db
}
