const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
import keys from './keys'
import { userCollection } from '../data/collections/users'

const googleOptions = {
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
}

export function begin() {
    passport.use(
            new GoogleStrategy(googleOptions,
            //@ts-ignore
            async (accessToken, refreshToken, profile, done) => {
                const userExists = await userCollection.exists({ googleId: profile.id })
                if(!userExists) {
                    await userCollection.insert({
                        email: profile.emails[0].value,
                        googleId: profile.id
                    })
                }
            }
        )
    )
}