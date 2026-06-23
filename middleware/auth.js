const express = require('express')
const router = express.Router()
const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const verifyToken =  (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) return res.status(401).json({ error: 'No token provided' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token'})
    }
}

module.exports = verifyToken