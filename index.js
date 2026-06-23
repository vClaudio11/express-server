const express = require('express')
const app = express()
const pool = require('./db')
const authRouter = require('./routes/auth')
const verifyToken = require('./middleware/auth')
const habitsRouter = require('./routes/habits')
const cors = require('cors')

app.use(express.json())
app.use('/auth', authRouter)
app.use('/habits', verifyToken, habitsRouter)
app.use(cors({ origin: 'http://localhost:5173' }))

app.listen(3000, () => {
    console.log('Listening on port 3000')
})