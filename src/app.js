const express = require("express");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Routes
const sheetRoutes = require("./routes/sheetRoutes");
const { parseFormula } = require("./engine/parser");

app.use("/api", sheetRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Port
const PORT = process.env.API_PORT || 8080;

//console.log(parseFormula("=A1 + 5 * (B2 - 3)"));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});