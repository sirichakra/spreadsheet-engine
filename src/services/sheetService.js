// In-memory storage
const sheets = {};
const { recalculate, evaluateCell } = require("../engine/evaluator");

/*
Each sheet:
{
  cells: {
    A1: {
      raw: 10,
      value: 10,
      dependencies: [],
      dependents: []
    }
  }
}
*/

// Ensure sheet exists
function getOrCreateSheet(sheetId) {
  if (!sheets[sheetId]) {
    sheets[sheetId] = { cells: {} };
  }
  return sheets[sheetId];
}

// Ensure cell exists
function getOrCreateCell(sheet, cellId) {
  if (!sheet.cells[cellId]) {
    sheet.cells[cellId] = {
      raw: null,
      value: null,
      dependencies: [],
      dependents: []
    };
  }
  return sheet.cells[cellId];
}

// Set Cell
const { parseFormula } = require("../engine/parser");
const { hasCycle } = require("../engine/graph");

function setCell(sheetId, cellId, input) {
  const sheet = getOrCreateSheet(sheetId);
  const cell = getOrCreateCell(sheet, cellId);

  // Remove old dependencies
  cell.dependencies.forEach(dep => {
    const depCell = getOrCreateCell(sheet, dep);
    depCell.dependents = depCell.dependents.filter(c => c !== cellId);
  });

  cell.dependencies = [];

  cell.raw = input;

  // If NOT formula
  if (typeof input !== "string" || !input.startsWith("=")) {
  cell.value = input;

  // 🔥 IMPORTANT: trigger recalculation
  recalculate(sheet, cellId);

  return;
}

  // Parse formula
  const { dependencies } = parseFormula(input);

  // Build graph (dependents graph)
// Build graph
const graph = {};
for (let key in sheet.cells) {
  graph[key] = [...(sheet.cells[key].dependents || [])];
}

// 🔥 Add temporary edges (simulate new dependencies)
for (let dep of dependencies) {
  if (!graph[dep]) graph[dep] = [];
  graph[dep].push(cellId);
}

// 🔥 Check cycle
// 🔥 Check cycle properly
for (let dep of dependencies) {
  if (hasCycle(graph, cellId, dep)) {
    cell.value = "#CYCLE!";
    return;
  }
}

  // Update dependencies
  cell.dependencies = dependencies;

  dependencies.forEach(dep => {
    const depCell = getOrCreateCell(sheet, dep);
    depCell.dependents.push(cellId);
  });

  // TEMP store formula (evaluation next step)
    // Evaluate current cell
    evaluateCell(sheet, cellId);

    // Recalculate dependents
    recalculate(sheet, cellId);
}

// Get Cell
function getCell(sheetId, cellId) {
  const sheet = sheets[sheetId];
  if (!sheet) return null;

  return sheet.cells[cellId];
}

module.exports = {
  setCell,
  getCell,
  sheets // exporting for future engine use
};