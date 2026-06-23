const express = require('express')
const router = express.Router()
const pool = require('../db')

router.post('/', async (req, res) => {
    try {
        const { name, frequency } = req.body
        if (!name || !frequency) {
            return res.status(400).json({ error: 'Name and frequency are required'})
        }
        const result = await pool.query(
            'INSERT INTO habits (name, frequency, user_id) VALUES ($1, $2, $3) RETURNING *',
            [name, frequency, req.userId]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        return res.status(500).json({ error: 'Failed to create habit'})
    }
})

router.delete('/:id', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM habits WHERE user_id = $1', [req.userId])
        res.status(200).json(result.rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch habits'})
    } 
})

module.exports = router