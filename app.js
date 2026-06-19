require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {

    if (err) {
        console.error("MySQL Connection Failed");
        console.error(err.message);
        process.exit(1);
    }

    console.log("Connected To MySQL");

    db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        )
    `, (err) => {

        if (err) {
            console.error("Failed To Create Users Table");
            console.error(err.message);
            return;
        }

        console.log("Users Table Ready");
    });

});

app.get('/', (req, res) => {

    res.json({
        application: "NodeJS MySQL Demo",
        status: "Running"
    });

});

app.get('/health', (req, res) => {

    res.status(200).json({
        status: "UP"
    });

});

app.get('/users', (req, res) => {

    db.query(
        'SELECT * FROM users',
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );

});

app.post('/users', (req, res) => {

    const name = req.body.name || "Rutik";

    db.query(
        'INSERT INTO users(name) VALUES(?)',
        [name],
        (err) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "User Added Successfully"
            });
        }
    );

});

app.listen(PORT, () => {

    console.log(`Server Running On Port ${PORT}`);

});
