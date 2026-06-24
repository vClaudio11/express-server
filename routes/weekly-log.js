const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM weekly_log WHERE user_id = $1 ORDER BY date ASC',
            [req.userId]
        )
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weeklyLog' })
    }
})

router.put('/:date', async (req, res) => {
    try {
        const { date } = req.params
        const { completed, total } = req.body
        const result = await pool.query(
            'UPDATE weekly_log SET completed = $1, total = $2 WHERE date = $3 AND user_id = $4 RETURNING *',
            [completed, total, date, req.userId]
        )
        res.status(200).json(result.rows[0])
    } catch (error) {
        res.status(500).json({ error: 'Failed to updated weekly log' })
    }
})

router.post('/seed', async (req, res) => {
    try {
        const seed = req.body

        // Check if rows already exist for the current user
        const existing = await pool.query(
            'SELECT id FROM weekly_log WHERE user_id = $1 LIMIT 1',
            [req.userId]
        )
        if (existing.rows.length > 0) {
            return res.status(200).json({ message: 'Already seeded' })
        }

        if (!Array.isArray(seed) || seed.length === 0) {
            return res.status(400).json({ error: 'Array is empty' })
        }
        for (const day of seed) {
            await pool.query(
                'INSERT INTO weekly_log (user_id, date, completed, total) VALUES ($1, $2, $3, $4)',
                [req.userId, day.date, day.completed, day.total]
            )
        }
        res.status(200).json({ message: 'Weekly Log seeded' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to modify weeklyLog' })
    }
})

module.exports = router