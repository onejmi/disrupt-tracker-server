import { Router } from 'express'
export const router = Router()
const passport = require('passport')

router.get(
        '/google', 
        passport.authenticate('google', {
            scope: ['profile']
        }
    )
)

router.get(
    '/google/redirect',
    (req, res) => {
        res.send("You reached the callback URI!")
    }
)