const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const pool = require("../db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// register a new user
router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    let { email, password } = req.body;
    email = email.toLowerCase();

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
        [email, hashedPassword]
      );

      res.json({ success: true, user: result.rows[0] });
    } catch (error) {
      console.error("🚨 Signup Error:", error);

      if (error.code === "23505") {
        return res.status(400).json({ error: "Email Already In Use" });
      }
      res.status(500).json({ error: error.message });
    }
  }
);

// user login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  try {
    let user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0)
      return res.status(400).json({ error: "Invalid Credentials" });

    const isValid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error Logging In:", error);
    res.status(500).json({ error: "Something Went Wrong. Please Try Again." });
  }
});

module.exports = router;
