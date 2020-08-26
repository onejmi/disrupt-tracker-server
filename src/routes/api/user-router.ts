import { Router } from 'express'
import { userCollection, Disruption, Tag } from '../../data/collections/users'
import { ObjectId, PushOperator, PullOperator, UpdateWriteOpResult } from 'mongodb'
export const userRouter = Router()

const tagLimit = 50
const nameLimit = 18

userRouter.get('/disruptions', async (req: any, res) => {
    res.json(req.user?.disruptions)
})

userRouter.post('/disruptions', async (req: any, res) => {
    const id = new ObjectId(req.user._id)
    const disruption : Disruption = {
        tagID: ObjectId.createFromHexString(req.body.tagID),
        startTime: req.body.startTime,
        endTime: req.body.endTime
    }
    const lastElemIndex = req.user.disruptions.length - 1
    if(lastElemIndex > -1 && req.user.disruptions[lastElemIndex].endTime > disruption.startTime) {
        const lastDisrupt = req.user.disruptions[lastElemIndex]
        if(lastDisrupt.endTime >= disruption.endTime) {
            res.status(405)
            res.json({ status: "Time conflict with your last disruption!" })
            return
        }
        disruption.startTime = lastDisrupt.endTime
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
    res.json(req.user?.tags)
})

userRouter.post('/tags', async (req: any, res) => {
    if(req.user.tags.length >= tagLimit) {
        res.status(429)
        res.send({ status: "You've reached the tag limit for your tier!" })
    } else {
        const id = new ObjectId(req.user._id)
        const name = req.body.name
        if(!name || name.length > nameLimit) {
            res.status(422)
            res.json({ status: "Tag name length is not between 1-" + nameLimit + " characters." })
            return
        }
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
    let name = req.body.name
    if(name && name.length > nameLimit) {
        res.status(422)
        res.json({ status: "Tag name is too long." })
        return
    }
    const color = req.body.color
    const payload = { 
        ...( name && { 'tags.$.name' : name } ), 
        ...( color >= 0 && { 'tags.$.color' : color } ) }
    if(Object.keys(payload).length === 0 && payload.constructor === Object) {
        res.json({ status: "Empty edit!" }) 
        return
    }
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
        const tagId : ObjectId = ObjectId.createFromHexString(req.body.tagId)
        const pullOperation : PullOperator<Tag> = { tags: { id: tagId } }
        const pullDisruptionsOperation : PullOperator<Disruption> = { disruptions: { tagID: tagId } }
        await userCollection.update({_id: id}, { $pull: pullDisruptionsOperation }, true)
        update = await userCollection.update({_id: id}, { $pull: pullOperation })
    }
    res.json(update.upsertedId)
})

userRouter.get('/threshold', async (req: any, res) => {
    res.json({ threshold: req.user?.threshold })
})

userRouter.put('/threshold', async (req: any, res) => {
    const id = new ObjectId(req.user._id)
    let update : UpdateWriteOpResult = 
        await userCollection.update({_id: id}, { $set: { threshold: req.body.threshold } })
    res.json(update.upsertedId)
})

userRouter.get('/nonce', async (req: any, res) => {
    res.json({ nonce: req.user?.nonce })
})

userRouter.put('/nonce', async (req: any, res) => {
    const id = new ObjectId(req.user._id)
    let update : UpdateWriteOpResult = 
        await userCollection.update({_id: id}, { $set: { nonce: req.body.nonce } })
    res.json(update.upsertedId)
})