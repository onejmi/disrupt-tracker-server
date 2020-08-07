import { Router } from 'express'
export const router = Router()
const passport = require('passport')

router.get(
        '/google', 
        passport.authenticate('google', {
            scope: ['profile', 'email']
        }
    )
)

router.get(
    '/google/redirect',
    passport.authenticate('google'),
    (req, res) => {
        res.send("You reached the callback URI!")
    }
)