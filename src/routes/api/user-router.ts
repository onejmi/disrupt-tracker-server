import { Router } from 'express'
import { userCollection, Disruption, Tag } from '../../data/collections/users'
import { ObjectId, PushOperator, PullOperator, UpdateWriteOpResult } from 'mongodb'
export const userRouter = Router()

userRouter.get('/disruptions', async (req: any, res) => {
    res.json(req.user.disruptions)
})

userRouter.post('/disruptions', async (req: any, res) => {
    const id = new ObjectId(req.user._id)
    const disruption : Disruption = {
        tagID: ObjectId.createFromHexString(req.body.tagID),
        startTime: req.body.startTime,
        endTime: req.body.endTime
    }
    //todo figure out what PushOperator<Disruption> means :P
    const pushOperation : PushOperator<Disruption> = { disruptions: disruption }
    const update = await userCollection.update({_id: id}, { $push: pushOperation })
    res.json(update.upsertedId)
})

userRouter.delete('/disruptions', async (req: any, res) => {
    const id = new ObjectId(req.user._id)
    let update : UpdateWriteOpResult
    if(req.body.all) {
        update = await userCollection.update({_id: id}, { $set: { disruptions: [] } })
    } else {
        const startTime : number = req.body.startTime
        let pullOperation : PullOperator<Disruption>
        let multiple = false
        if(req.body.endTime) {
            //start time - end time (endtime exclusive)
            pullOperation = 
                { disruptions: { startTime: { $gte: req.body.startTime } , endTime: { $lt: req.body.endTime } } }
            multiple = true
        } else {
            pullOperation = 
                { disruptions: { startTime: startTime } }
        }
        update = await userCollection.update({_id: id}, { $pull: pullOperation }, multiple)
    }
    res.json(update.upsertedId)
})

userRouter.get('/tags', (req: any, res) => {
    res.json(req.user.tags)
})

userRouter.post('/tags', async (req: any, res) => {
    if(req.user.tags.length >= 50) {
        res.status(429)
        res.send({ status: "You've reached the tag limit for your tier!" })
    } else {
        const id = new ObjectId(req.user._id)
        const name = req.body.name
        const color = req.body.color
        const tag : Tag = {
            id: new ObjectId(),
            name: name,
            color: color
        }
        const pushOperation : PushOperator<Tag> = { tags: tag }
        const update = await userCollection.update({_id: id}, { $push: pushOperation })
        res.json(update.upsertedId)
    }
})

userRouter.patch('/tags', async (req: any, res) => {
    const id = new ObjectId(req.user._id)
    const tagId = ObjectId.createFromHexString(req.body.tagId)
    const name = req.body.name 
    const color = req.body.color
    const payload = { ...( name && { 'tags.$.name' : name } ), ...( color && { 'tags.$.color' : color } ) }
    const update = await userCollection.update(
        {_id: id, 'tags.id': tagId}, 
        { $set: payload }
    )
    res.json(update.upsertedId)
})

userRouter.delete('/tags', async (req: any, res) => {
    const id = new ObjectId(req.user._id)
    let update : UpdateWriteOpResult
    if(req.body.all) {
        update = await userCollection.update({_id: id}, { $set: { tags: [] } })
    } else {
        const tagId : number = req.body.tagId
        const pullOperation : PullOperator<Tag> = { tags: { id: tagId } }
        update = await userCollection.update({_id: id}, { $pull: pullOperation })
    }
    res.json(update.upsertedId)
})