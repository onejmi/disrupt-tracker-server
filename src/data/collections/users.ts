import DataCollection from './collection'

export interface Tag {
    readonly id: number
    name: string
    positive?: boolean
}

export interface Disruption {
    tagID: number
    readonly startTime: number
    endTime: number
}

export interface User {
    email: string
    name: string
    disruptions: Disruption[]
    tags: Tag[]
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