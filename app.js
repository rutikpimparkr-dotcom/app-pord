require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

console.log("========== APPLICATION CONFIG ==========");
console.log("PORT      :", process.env.PORT);
console.log("DB_HOST   :", process.env.DB_HOST);
console.log("DB_USER   :", process.env.DB_USER);
console.log("DB_NAME   :", process.env.DB_NAME);
console.log("========================================");

const db = mysql.createConnection({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME
});

db.connect((err) => {

```
if (err) {
    console.error("❌ MySQL Connection Failed");
    console.error(err.message);
    process.exit(1);
}

console.log("✅ Connected To MySQL");

db.query(`
    CREATE TABLE IF NOT EXISTS users(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100)
    )
`, (err) => {

    if (err) {
        console.error("❌ Failed To Create Users Table");
        console.error(err.message);
        return;
    }

    console.log("✅ Users Table Ready");
});
```

});

app.get('/', (req, res) => {

```
res.json({
    application: "NodeJS MySQL Demo",
    status: "Running",
    mysql_host: process.env.DB_HOST,
    database: process.env.DB_NAME
});
```

});

app.get('/health', (req, res) => {

```
res.status(200).json({
    status: "UP",
    timestamp: new Date()
});
```

});

app.get('/info', (req, res) => {

```
res.json({
    application: "NodeJS MySQL Demo",
    status: "Running",
    port: PORT,
    db_host: process.env.DB_HOST,
    db_user: process.env.DB_USER,
    db_name: process.env.DB_NAME,
    timestamp: new Date()
});
```

});

app.get('/dbcheck', (req, res) => {

```
db.query(
    'SELECT NOW() AS current_time',
    (err, rows) => {

        if (err) {
            return res.status(500).json({
                mysql: "FAILED",
                error: err.message
            });
        }

        res.json({
            mysql: "CONNECTED",
            server_time: rows[0].current_time
        });
    }
);
```

});

app.get('/users', (req, res) => {

```
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
```

});

app.get('/count', (req, res) => {

```
db.query(
    'SELECT COUNT(*) AS total_users FROM users',
    (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows[0]);
    }
);
```

});

app.post('/users', (req, res) => {

```
const name = req.body.name || "Rutik";

db.query(
    'INSERT INTO users(name) VALUES(?)',
    [name],
    (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            message: "User Added Successfully",
            inserted_id: result.insertId,
            name: name
        });
    }
);
```

});

app.listen(PORT, () => {

```
console.log("========================================");
console.log(`🚀 Server Running On Port ${PORT}`);
console.log(`📌 Health Check : /health`);
console.log(`📌 App Info     : /info`);
console.log(`📌 DB Check     : /dbcheck`);
console.log(`📌 Users List   : /users`);
console.log(`📌 Users Count  : /count`);
console.log("========================================");
```

});
