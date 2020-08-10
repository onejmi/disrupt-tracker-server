import { Router } from "express";
import { userRouter } from './user-router'

export const apiRouter = Router()

apiRouter.use('/user', userRouter)
apiRouter.get('/status', (req: any, res) => {
    res.json({authenticated: req.user != null})
})