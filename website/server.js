const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// GET route to fetch comments
app.get("/comments", (req, res) => {
    const sql = "SELECT * FROM comments";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST route to add a new comment
app.post("/comments", (req, res) => {
    const { name, comment } = req.body;

    // Validation
    if (!name || !comment) {
        return res.status(400).json({ error: "Name and comment are required" });
    }

    const sql = "INSERT INTO comments (name, comment) VALUES (?, ?)";
    const params = [name, comment];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name, comment });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


const { body, validationResult } = require("express-validator");

// POST route with validation
app.post(
    "/comments",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("comment").notEmpty().withMessage("Comment is required"),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, comment } = req.body;
        const sql = "INSERT INTO comments (name, comment) VALUES (?, ?)";
        const params = [name, comment];

        db.run(sql, params, function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, name, comment });
        });
    }
);


