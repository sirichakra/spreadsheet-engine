const sheetService = require("../services/sheetService");

// PUT - Set Cell
exports.setCell = (req, res) => {
  try {
    const { sheetId, cellId } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ error: "Value is required" });
    }

    sheetService.setCell(sheetId, cellId, value);

    return res.status(200).json({ message: "Cell updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET - Get Cell
exports.getCell = (req, res) => {
  try {
    const { sheetId, cellId } = req.params;

    const cell = sheetService.getCell(sheetId, cellId);

    if (!cell) {
      return res.status(404).json({ error: "Cell not found" });
    }

    return res.status(200).json({ value: cell.value });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};