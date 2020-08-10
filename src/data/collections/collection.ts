import { Collection, FilterQuery, UpdateQuery } from "mongodb"
import { database } from '../db-manager'

export default abstract class DataCollection<T> {

    readonly name: string
    readonly col: Collection

    constructor(name: string) {
        this.name = name
        this.col = database.collection(name)
    }

    async insert(...items: T[]) {
        if(items.length > 1) {
            return await this.col.insertMany(items)
        }
        return await this.col.insertOne(items[0])
    }

    async get(filter: FilterQuery<any>, multiple: boolean = false) {
        if(multiple) {
            return await this.col.find(filter)
        }
        return await this.col.findOne(filter)
    }

    async exists(filter: FilterQuery<any>) : Promise<boolean> {
        return await this.col.find(filter).limit(1).count(true) > 0
    }

    async update(filter: FilterQuery<any>, update: UpdateQuery<any>, multiple: boolean = false, upsert: boolean = false) {
        if(multiple) {
            return await this.col.updateMany(filter, update, {upsert: upsert})
        }
        return await this.col.updateOne(filter, update, {upsert: upsert})
    }

    async deleteWhere(filter: FilterQuery<any>, multiple: boolean = false) {
        if(multiple) {
            return await this.col.deleteMany(filter)
        }
        return await this.col.deleteOne(filter)
    }

}