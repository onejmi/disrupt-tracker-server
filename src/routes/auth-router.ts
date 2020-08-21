import { Router } from 'express'
import keys from '../config/keys'

export const router = Router()
const passport = require('passport')

router.post(
    '/logout',
    (req: any, res) => {
        req.logout()
        res.send({status: "OK"})
    }
)

router.get(
        '/google', 
        passport.authenticate('google', {
            scope: ['profile', 'email']
        }
    )
)

router.get(
        '/github',
        passport.authenticate('github', {
            scope: ['user:email']
        }
    )
)

router.get(
    '/google/redirect',
    passport.authenticate('google'),
    (req: any, res) => {
       res.send(`<script>window.location.href = '${keys.frontEndUrl}'</script>`)
    }
)

router.get(
    '/github/redirect',
    passport.authenticate('github'),
    (req: any, res) => {
       //res.send(`<script>window.location.href = '${keys.frontEndUrl}' + '/auth/success.html'</script>`)
       res.send(`<script>window.location.href = '${keys.frontEndUrl}'</script>`)
    }
)