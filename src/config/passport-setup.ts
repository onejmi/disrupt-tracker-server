import passport from 'passport'

const GoogleStrategy = require('passport-google-oauth20')
const GithubStrategy = require('passport-github2')

import { createTokenAuth } from "@octokit/auth-token";
import { request } from "@octokit/request";
import { ObjectId } from "mongodb"
//import keys from './keys' (use when locally)
import { userCollection } from '../data/collections/users'

const keys = JSON.parse(process.env.config_keys)

const googleOptions = {
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
}

const githubOptions = {
    callbackURL: '/auth/github/redirect',
    clientID: keys.github.clientID,
    clientSecret: keys.github.clientSecret
}

async function insertUser(profile: any, email: string) {
    const res = await userCollection.insert({
        email: email,
        name: profile.displayName,
        disruptions: [],
        tags: [],
        threshold: 100,
        nonce: 0,
        settings: { dark: false, tickSound: true },
        profileImageUrl: profile.photos[0].value,
        googleId: profile.id,
    })
    return res.ops[0]
}

export function begin() {
    passport.serializeUser((user: any, done: any) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id: any, done: any) => {
        const user = await userCollection.get({ _id : new ObjectId(id) })
        done(null, user)
    })

    passport.use(
            new GoogleStrategy(googleOptions,
            //@ts-ignore
            async (accessToken, refreshToken, profile, done) => {
                let user = await userCollection.get({ googleId: profile.id })
                if(!user) {
                    user = await insertUser(profile, profile.emails[0].value)
                }
                done(null, user)
            }
        )
    )

    passport.use(
            new GithubStrategy(githubOptions,
            //@ts-ignore
            async (accessToken, refreshToken, profile, done) => {
                let user = await userCollection.get({ githubId: profile.id })
                if(!user) {
                    let email : string
                    if(profile.emails == null) {
                        const auth = createTokenAuth(accessToken)
                        const res = await auth.hook(request, "GET /user/emails")
                        if(res.data.length > 0) {
                            email = res.data[0].email
                        }
                    } else email = profile.emails[0].value
                    user = insertUser(profile, email)
                }
                done(null, user)
            }
        )
    )

}