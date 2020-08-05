const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
import keys from './keys'

const googleOptions = {
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
}

export function begin() {
    passport.use(
            new GoogleStrategy(googleOptions,
            () => {
                //passport callback function
            }
        )
    )
}