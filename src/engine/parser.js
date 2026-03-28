// Token types
const TOKEN_TYPES = {
  NUMBER: "NUMBER",
  OPERATOR: "OPERATOR",
  PAREN: "PAREN",
  CELL: "CELL"
};

// Check if valid cell (A1, B20, AZ100)
function isCellReference(token) {
  return /^[A-Z]+[0-9]+$/.test(token);
}

// Tokenizer
function tokenize(formula) {
  const tokens = [];
  let i = 0;

  while (i < formula.length) {
    let char = formula[i];

    // Skip spaces
    if (char === " ") {
      i++;
      continue;
    }

    // Numbers (including decimals)
    if (/[0-9.]/.test(char)) {
      let num = "";
      while (i < formula.length && /[0-9.]/.test(formula[i])) {
        num += formula[i];
        i++;
      }
      tokens.push({ type: TOKEN_TYPES.NUMBER, value: parseFloat(num) });
      continue;
    }

    // Operators
    if (["+", "-", "*", "/"].includes(char)) {
      tokens.push({ type: TOKEN_TYPES.OPERATOR, value: char });
      i++;
      continue;
    }

    // Parentheses
    if (["(", ")"].includes(char)) {
      tokens.push({ type: TOKEN_TYPES.PAREN, value: char });
      i++;
      continue;
    }

    // Cell reference (A1, B2)
    if (/[A-Z]/.test(char)) {
      let ref = "";
      while (i < formula.length && /[A-Z0-9]/.test(formula[i])) {
        ref += formula[i];
        i++;
      }

      if (!isCellReference(ref)) {
        throw new Error("Invalid cell reference");
      }

      tokens.push({ type: TOKEN_TYPES.CELL, value: ref });
      continue;
    }

    throw new Error(`Invalid character: ${char}`);
  }

  return tokens;
}

// Extract dependencies
function extractDependencies(tokens) {
  const deps = new Set();

  tokens.forEach(token => {
    if (token.type === TOKEN_TYPES.CELL) {
      deps.add(token.value);
    }
  });

  return Array.from(deps);
}

// Main parser
function parseFormula(input) {
  if (!input.startsWith("=")) {
    return null;
  }

  const formula = input.slice(1); // remove "="

  const tokens = tokenize(formula);
  const dependencies = extractDependencies(tokens);

  return {
    tokens,
    dependencies
  };
}

module.exports = {
  parseFormula
};