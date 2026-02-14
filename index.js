const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// 1. Connection setup sa PhpMyAdmin
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // default user sa XAMPP
    password: '',      // default password sa XAMPP ay blank
    database: 'hiking_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to PhpMyAdmin Database!');
});

// ENDPOINT 1: Get All Mountains [cite: 8, 16]
app.get('/api/mountains', (req, res) => {
    const sql = 'SELECT * FROM trails';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results); // Realistic JSON response [cite: 9, 10]
    });
});

// ENDPOINT 2: Get Mountain by ID [cite: 8, 34]
app.get('/api/mountains/:id', (req, res) => {
    const sql = 'SELECT * FROM trails WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Trail not found" });
        res.json(result[0]);
    });
});

// ENDPOINT 3: Filter by High Difficulty (7/9 and above) [cite: 8]
app.get('/api/difficulty/challenging', (req, res) => {
    const sql = "SELECT * FROM trails WHERE CAST(SUBSTRING_INDEX(difficulty_level, '/', 1) AS UNSIGNED) >= 7";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ENDPOINT 4: Search by Location Keyword [cite: 8]
app.get('/api/search/location', (req, res) => {
    const place = req.query.q; // Gamit: /api/search/location?q=Zambales
    const sql = 'SELECT * FROM trails WHERE location LIKE ?';
    db.query(sql, [`%${place}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ENDPOINT 5: Get Short Hikes (Time in hours or minutes only, not days) [cite: 8]
app.get('/api/trails/quick', (req, res) => {
    const sql = "SELECT * FROM trails WHERE estimated_time NOT LIKE '%day%'";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Hiking API listening at http://localhost:${port}`);
});