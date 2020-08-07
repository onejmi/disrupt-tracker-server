import DataCollection from './collection'

export interface User {
    email: string
    googleId: string
}

class UserCollection extends DataCollection<User> {
    constructor() {
        super('users')
    }
}

export const userCollection = new UserCollection()