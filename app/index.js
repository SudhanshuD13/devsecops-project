const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

const TEST_SECRET = "AWS_SECRET_ACCESS_KEY=abcdEFGHijklMNOPqrstUVWXyz1234567890AB";

// DB config from ENV (IMPORTANT)
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432
});

app.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

app.get("/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
