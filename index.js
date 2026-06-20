
const express = require('express')
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server is alive')
})

app.get('/about', (req, res) => {
    res.send('This is the about page')
})

const habits = []

app.post('/habits', (req, res) => {
    const habit = req.body
    habits.push(habit)
    res.json({ message: 'Habit saved', habit})
})

app.get('/habits', (req, res) => {
    res.json(habits)
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})
