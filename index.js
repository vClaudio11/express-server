
const pool = require('./db')
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

app.post('/habits', async (req, res) => {
    const { name, frequency } = req.body
    const result = await pool.query(
        'INSERT INTO habits (name, frequency) VALUES ($1, $2) RETURNING *',
        [name, frequency]
    )
    res.json(result.rows[0])
})

app.get('/habits', async (req, res) => {
    const result = await pool.query('SELECT * FROM habits')
    res.json(result.rows)
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})
