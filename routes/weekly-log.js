const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
    try {
        // let backend check for the seeded days so it is always synced 
        const dates = Array.from({length: 7}, (_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - (6 - i))
            return d.toLocaleDateString('sv-SE')
        })

        const logs = []

        for (const date of dates) {
            const result = await pool.query(
                'INSERT INTO weekly_log (date, user_id, completed, total) VALUES ($1, $2, 0, 0) ON CONFLICT (date, user_id) DO UPDATE SET date = EXCLUDED.date RETURNING *',
                [date, req.userId]
            )
            logs.push(result.rows[0])
        }

        res.status(200).json(logs)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch weeklyLog' })
    }
})

router.put('/:date', async (req, res) => {
    try {
        const { date } = req.params
        const { completed, total } = req.body

        const result = await pool.query(
            'INSERT INTO weekly_log (completed, total, date, user_id) VALUES ($1, $2, $3, $4) ON CONFLICT (date, user_id) DO UPDATE SET completed = EXCLUDED.completed, total = EXCLUDED.total RETURNING *',
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