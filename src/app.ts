const express = require('express')
import { router as authRouter } from './routes/auth-router'

const app = express()
const cors = require('cors')
const passportSetup = require('./config/passport-setup')
const port = 3000
const frontendLocation = 'http://localhost:8080'

passportSetup.begin()
// app.options('*', cors(frontendLocation))
app.use(cors(frontendLocation))
app.use('/auth', authRouter)

app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})