const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const GithubStrategy = require('passport-github2')

import { createTokenAuth } from "@octokit/auth-token";
import { request } from "@octokit/request";
import { ObjectId } from "mongodb"
import keys from './keys'
import { userCollection } from '../data/collections/users'

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
                    const res = await userCollection.insert({
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        disruptions: [],
                        tags: [],
                        profileImageUrl: profile.photos[0].value,
                        googleId: profile.id
                    })
                    user = res.ops[0]
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
                    const res = await userCollection.insert({
                        email: email,
                        name: profile.displayName,
                        disruptions: [],
                        tags: [],
                        profileImageUrl: profile.photos[0].value,
                        githubId: profile.id
                    })
                    user = res.ops[0]
                }
                done(null, user)
            }
        )
    )

}