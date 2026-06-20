
const express = require('express')
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server is alive')
})

app.get('/about', (req, res) => {
    res.send('This is the about page')
})

app.post('/habits', (req, res) => {
    console.log(req.body)
    res.send('Habit received')
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})
