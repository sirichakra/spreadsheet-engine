const express = require("express");
const router = express.Router();

const {
  setCell,
  getCell
} = require("../controllers/sheetController");

// Set Cell Value
router.put("/sheets/:sheetId/cells/:cellId", setCell);

// Get Cell Value
router.get("/sheets/:sheetId/cells/:cellId", getCell);

module.exports = router;