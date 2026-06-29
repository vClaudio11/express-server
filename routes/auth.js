const express = require('express')
const router = express.Router()
const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, password are required'})
        }

        // check that email is unique
        const existing = await pool.query(
            'SELECT email FROM users WHERE email = $1 LIMIT 1',
            [email]
        )

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "Emaill already exists" })
        }

        // if email is unique then insert a new row into users table
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, email',
            [username, email, hashedPassword]
        )
        return res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: 'Registration failed'})
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 ',
            [email]
        )

        const user = result.rows[0]
        // Check if email exists in current database
        if (!user) {
            return res.status(401).json({ error: 'There is no account created yet for this email' })
        }

        // Compare current and stored password
        const correct = await bcrypt.compare(password, user.password)
        if (!correct) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.status(200).json({ token })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Failed to login'})
    }
})

module.exports = router