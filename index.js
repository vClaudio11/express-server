
const express = require('express')
const app = express()
const pool = require('./db')
const authRouter = require('./routes/auth')

app.use(express.json())
app.use('/auth', authRouter)


app.post('/habits', async (req, res) => {
    try {
        const { name, frequency } = req.body
        if (!name || !frequency) {
            return res.status(400).json({ error: 'Name and frequency are required'})
        }
        const result = await pool.query(
            'INSERT INTO habits (name, frequency) VALUES ($1, $2) RETURNING *',
            [name, frequency]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        return res.status(500).json({ error: 'Failed to create habit'})
    }
})

app.delete('/habits/:id', async (req, res) => {
    try{
        const { id } = req.params
        const result = await pool.query(
            'DELETE FROM habits WHERE id = $1',
            [id]
        )
        return res.status(200).json({ message: 'Habit deleted'})
    } catch (err) {
        return res.status(500).json({ error: 'Failed to delete habit'})
    }
})

app.put('/habits/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name, frequency } = req.body
        if (!name || !frequency) {
            return res.status(400).json({ error: 'Name and frequency are required'})
        }
        const result = await pool.query(
            'UPDATE habits SET name = $1, frequency = $2 WHERE id = $3 RETURNING *',
            [name, frequency, id]
        )
        res.status(200).json(result.rows[0])
    } catch(err) {
        res.status(500).json({ error: 'Failed to update habit'})
    }
})

app.get('/habits', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM habits')
        res.status(201).json(result.rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch habits'})
    } 
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})
