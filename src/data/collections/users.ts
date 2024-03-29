import DataCollection from './collection'
import { ObjectId } from 'mongodb'

export interface Tag {
    readonly id: ObjectId
    name: string
    color: number
    positive?: boolean
}

export interface Disruption {
    tagID: ObjectId
    startTime: number
    endTime: number
}

export interface Settings {
    dark: boolean
    tickSound: boolean
}

export interface User {
    email: string
    name: string
    disruptions: Disruption[]
    tags: Tag[]
    threshold: number,
    nonce: number,
    settings: Settings
    profileImageUrl?: string
    googleId?: string
    githubId?: string
}

export class UserCollection extends DataCollection<User> {
    private constructor() {
        super('users')
    }

    static init() {
        userCollection = new UserCollection()
    }
}

export let userCollection : UserCollection