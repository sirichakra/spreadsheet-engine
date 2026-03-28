// Detect cycle using DFS
function hasCycle(graph, start, target, visited = new Set()) {
  if (start === target) return true;

  if (visited.has(start)) return false;
  visited.add(start);

  const neighbors = graph[start] || [];

  for (let next of neighbors) {
    if (hasCycle(graph, next, target, visited)) {
      return true;
    }
  }

  return false;
}

module.exports = {
  hasCycle
};