
const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('Server is alive')
})

app.get('/about', (req, res) => {
    res.send('This is the about page')
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})
