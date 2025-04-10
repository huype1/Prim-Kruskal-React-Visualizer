export class Dijkstra {
  constructor(matrix) {
    this.nodes = matrix[0].slice(1);
    this.distances = {};
    this.matrix = matrix;
    this.steps = [];

    this.nodes.forEach((node, index) => {
      this.distances[node] = {};

      this.nodes.forEach((innerNode, innerIndex) => {
        let weight = matrix[index + 1][innerIndex + 1];
        if (weight === "inf") {
          this.distances[node][innerNode] = Infinity;
        } else {
          this.distances[node][innerNode] = parseFloat(weight);
        }
      });
    });
  }

  findShortestPath(startNode) {
    let distances = {};
    let parents = {};
    let visited = new Set();
    let unvisited = new Set(this.nodes);

    for (let node in this.distances) {
      distances[node] = Infinity;
      parents[node] = null;
    }
    distances[startNode] = 0;

    while (unvisited.size > 0) {
      // Find the node with the smallest distance from the unvisited set
      let currentNode = Array.from(unvisited).reduce(
        (minNode, node) => (distances[node] < distances[minNode] ? node : minNode),
        Array.from(unvisited)[0]
      );

      unvisited.delete(currentNode);
      visited.add(currentNode);

      // Update the distances of all adjacent nodes of the current node
      for (let neighbor in this.distances[currentNode]) {
        if (visited.has(neighbor)) continue;
        let newDistance = distances[currentNode] + this.distances[currentNode][neighbor];
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          parents[neighbor] = currentNode;
        }
      }

      // console.log({ currentNode, visited: new Set([...visited]) });
      this.steps.push({
        currentNode,
        distances: { ...distances },
        visited: [...visited],
      });
    }

    return { distances, parents, steps: this.steps };
  }
}
