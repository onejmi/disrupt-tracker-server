import { Router } from 'express'
import { userCollection, Disruption } from '../../data/collections/users'
import { ObjectId, PushOperator } from 'mongodb'
export const userRouter = Router()

userRouter.get('/disruptions', async (req: any, res) => {
    res.json(req.user.disruptions)
})

userRouter.post('/disruptions', async (req: any, res) => {
    const id = new ObjectId(req.user._id)
    const disruption : Disruption = req.body
    //todo figure out what PushOperator<Disruption> means :P
    const pushOperation : PushOperator<Disruption> = { disruptions: disruption }
    const update = await userCollection.update({_id: id}, { $push: pushOperation })
    res.json(update.upsertedId)
})

userRouter.delete('/disruptions', (req: any, res) => {
    const id = new ObjectId(req.user._id)
    const disruptionId = req.body.id
    //todo delete func
})