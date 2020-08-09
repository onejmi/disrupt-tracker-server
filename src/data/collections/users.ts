import DataCollection from './collection'

export interface User {
    email: string,
    name: string,
    profileImageUrl?: string
    googleId?: string
    githubId?: string
}

class UserCollection extends DataCollection<User> {
    constructor() {
        super('users')
    }
}

export const userCollection = new UserCollection()