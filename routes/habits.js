const express = require('express')
const router = express.Router()
const pool = require('../db')

router.post('/', async (req, res) => {
    try {
        const { title, type, description } = req.body
        if (!title || !type || !description) {
            return res.status(400).json({ error: 'Title, type and description are required'})
        }
        const result = await pool.query(
            'INSERT INTO habits (title, type, description, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, type, description, req.userId]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        return res.status(500).json({ error: 'Failed to create habit'})
    }
})

router.delete('/:id', async (req, res) => {
    try{
        const { id } = req.params
        await pool.query(
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
        const { title, type, description } = req.body
        if (!title || !type || !description) {
            return res.status(400).json({ error: 'title, type and description are required'})
        }
        const result = await pool.query(
            'UPDATE habits SET title = $1, type = $2, description = $3 WHERE id = $4 RETURNING *',
            [title, type, description, id]
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

router.patch('/:id/checked', async (req, res) => {
    try {
        const { id } = req.params
        const { completed } = req.body
        const response = await pool.query(
            'UPDATE habits SET completed = $1 where id = $2 AND user_id = $3 RETURNING *',
            [completed, id, req.userId]
        )
        
        res.status(200).json(response.rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to update habits Todo'})
    }
})

module.exports = router