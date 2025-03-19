const express = require("express");
const pool = require("../db");
const authenticate = require("../middleware/auth");

const router = express.Router();

// create a new form
router.post("/", authenticate, async (req, res) => {
  try {
    const { formName, fields } = req.body;

    if (!formName.trim()) {
      return res.status(400).json({ error: "Form Name is Required." });
    }

    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ error: "At Least One Field is Required." });
    }

    const { rows } = await pool.query(
      "INSERT INTO forms (form_name, fields, user_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [formName, JSON.stringify(fields), req.user.userId]
    );

    res.json({
      success: true,
      message: `Form "${formName}" Was Successfully Created.`,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error Creating Form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get all forms
router.get("/", authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, form_name, created_at FROM forms WHERE user_id = $1",
      [req.user.userId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error Fetching Forms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get form by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM forms WHERE id = $1", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Form Not Found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error Fetching Form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get form by id (authenticated route)
router.get("/secure/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM forms WHERE id = $1 AND user_id = $2",
      [id, req.user.userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized or Form Not Found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error Fetching Form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// update form
router.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { formName, fields } = req.body;

  if (!formName.trim()) {
    return res.status(400).json({ error: "Form Name Cannot Be Empty." });
  }

  if (!Array.isArray(fields) || fields.length === 0) {
    return res.status(400).json({ error: "Fields Must Be a Non-Empty Array." });
  }

  try {
    const { rowCount } = await pool.query(
      "UPDATE forms SET form_name = $1, fields = $2 WHERE id = $3 AND user_id = $4",
      [formName, JSON.stringify(fields), id, req.user.userId]
    );

    if (rowCount === 0) {
      return res.status(403).json({ error: "Unauthorized or Form Not Found" });
    }

    res.json({ success: true, message: "Form Has Been Updated." });
  } catch (error) {
    console.error("Error Updating Form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete form
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query(
      "DELETE FROM forms WHERE id = $1 AND user_id = $2",
      [id, req.user.userId]
    );

    if (rowCount === 0) {
      return res.status(403).json({ error: "Unauthorized or Form Not Found" });
    }

    res.json({ success: true, message: "Form Has Been Deleted." });
  } catch (error) {
    console.error("Error Deleting Form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
