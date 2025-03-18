const dns = require("dns");
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");

const formsRouter = require("./routes/forms");
const responsesRouter = require("./routes/responses");
const authRouter = require("./routes/auth");

const { Pool } = require("pg");

// dns config
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

// database config
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

// middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// route middleware
app.use("/api/auth", authRouter);
app.use("/api/forms", formsRouter);
app.use("/api/form-responses", responsesRouter);

// health check route
app.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ message: "FormPilot API Running", timestamp: rows[0] });
  } catch (error) {
    console.error("Error Accessing Database", error);
    res
      .status(500)
      .json({ error: "Database Access Error During Health Check" });
  }
});

// fallback for unknown paths
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found", route: req.originalUrl });
});

// server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is Running On Port ${PORT}`)
);

module.exports.handler = serverless(app);
