const { parseFormula } = require("./parser");

// Operator precedence
function precedence(op) {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  return 0;
}

// Apply operator
function applyOp(a, b, op) {
  // Priority handling
  if (a === "#CYCLE!" || b === "#CYCLE!") return "#CYCLE!";
  if (a === "#REF!" || b === "#REF!") return "#REF!";
  if (a === "#DIV/0!" || b === "#DIV/0!") return "#DIV/0!";

  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;

  if (op === "/") {
    if (b === 0) return "#DIV/0!";
    return a / b;
  }
}

// Evaluate expression using stack
function evaluateTokens(tokens, sheet) {
  const values = [];
  const ops = [];

  function processOp() {
    const b = values.pop();
    const a = values.pop();
    const op = ops.pop();
    values.push(applyOp(a, b, op));
  }

  for (let token of tokens) {
    if (token.type === "NUMBER") {
      values.push(token.value);
    }

    else if (token.type === "CELL") {
      const cell = sheet.cells[token.value];

      if (!cell) {
        values.push("#REF!");
      } else {
        values.push(cell.value);
      }
    }

    else if (token.type === "PAREN" && token.value === "(") {
      ops.push(token.value);
    }

    else if (token.type === "PAREN" && token.value === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") {
        processOp();
      }
      ops.pop();
    }

    else if (token.type === "OPERATOR") {
      while (
        ops.length &&
        precedence(ops[ops.length - 1]) >= precedence(token.value)
      ) {
        processOp();
      }
      ops.push(token.value);
    }
  }

  while (ops.length) {
    processOp();
  }

  return values[0];
}

// Evaluate single cell
function evaluateCell(sheet, cellId) {
  const cell = sheet.cells[cellId];

  if (!cell) return;

  if (typeof cell.raw !== "string" || !cell.raw.startsWith("=")) {
    return;
  }

  try {
    const { tokens } = parseFormula(cell.raw);
    const result = evaluateTokens(tokens, sheet);
    cell.value = result;
  } catch (err) {
    cell.value = "#REF!";
  }
}

// Recalculate dependents (DFS)
function recalculate(sheet, cellId, visited = new Set()) {
  if (visited.has(cellId)) return;
  visited.add(cellId);

  const cell = sheet.cells[cellId];
  if (!cell) return;

  evaluateCell(sheet, cellId);

  for (let dep of cell.dependents) {
    recalculate(sheet, dep, visited);
  }
}

module.exports = {
  evaluateCell,
  recalculate
};