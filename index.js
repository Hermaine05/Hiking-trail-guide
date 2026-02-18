const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000; 

const db = mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,        
    user: 'root',      
    password: '',      
    database: 'hiking_db'
});

db.connect((err) => {
    if (err) {
        console.error('DATABASE CONNECTION ERROR:', err.message);
        return;
    }
    console.log('Connected to PhpMyAdmin Database!');
});

// Get All Mountains
app.get('/api/mountains', (req, res) => {
    const sql = 'SELECT * FROM trails';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        res.json(results); 
    });
});

//Get Mountain by ID
app.get('/api/mountains/:id', (req, res) => {
    const sql = 'SELECT * FROM trails WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Trail not found" });
        res.json(result[0]); 
    });
});

//Filter by High Difficulty (7/9 and above)
app.get('/api/difficulty/challenging', (req, res) => {
    const sql = "SELECT * FROM trails WHERE CAST(SUBSTRING_INDEX(difficulty_level, '/', 1) AS UNSIGNED) >= 7";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        res.json(results);
    });
});

// Search Location 
app.get('/api/search/location', (req, res) => {
    const place = req.query.q; 
    if (!place) return res.status(400).json({ message: "Please provide a location query (e.g., ?q=Zambales)" });

    const sql = 'SELECT * FROM trails WHERE location LIKE ?';
    db.query(sql, [`%${place}%`], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        res.json(results);
    });
});

//Get Short Hikes 
app.get('/api/trails/quick', (req, res) => {
    const sql = "SELECT * FROM trails WHERE estimated_time NOT LIKE '%day%'";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Hiking API listening at http://localhost:${port}`);
});