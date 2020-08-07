const express = require('express')
import { router as authRouter } from './routes/auth-router'
import { setupDatabase } from './data/db-manager'

const app = express()
const cors = require('cors')
const port = 3000
const frontendLocation = 'http://localhost:8080'

console.log('Setting up database')
setupDatabase().then(() => {
  const passportSetup = require('./config/passport-setup')
  passportSetup.begin()
}).catch(err => console.log(err))

// app.options('*', cors(frontendLocation))
app.use(cors(frontendLocation))
app.use('/auth', authRouter)

app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})