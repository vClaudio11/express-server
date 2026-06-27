if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const cors = require('cors')
const express = require('express')
const app = express()
const pool = require('./db')
const authRouter = require('./routes/auth')
const verifyToken = require('./middleware/auth')
const habitsRouter = require('./routes/habits')
const weeklyLogRouter = require('./routes/weekly-log')

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://habit-tracker-von-claudio.vercel.app'
  ],
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/auth', authRouter)
app.use('/weekly-log', verifyToken, weeklyLogRouter)
app.use('/habits', verifyToken, habitsRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})