const express = require("express");
const router = express.Router();
const pool = require("../db");

// endpoint to submit form responses
router.post("/", async (req, res) => {
  const { formId, responses } = req.body;
  try {
    const newResponse = await pool.query(
      "INSERT INTO responses (form_id, response_data) VALUES ($1, $2) RETURNING *",
      [formId, JSON.stringify(responses)]
    );
    res.status(201).json({
      message: "Response Added Successfully.",
      data: newResponse.rows[0],
    });
  } catch (error) {
    console.error("Error Saving Form Response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// endpoint to retrieve responses by form id
router.get("/:formId", async (req, res) => {
  const { formId } = req.params;
  try {
    const responses = await pool.query(
      "SELECT * FROM responses WHERE form_id = $1",
      [formId]
    );
    res.json(responses.rows);
  } catch (error) {
    console.error("Error Fetching Responses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
