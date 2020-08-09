import { Router } from "express";

export const apiRouter = Router()

apiRouter.get('/status', (req: any, res) => {
    res.json({authenticated: req.user != null})
})