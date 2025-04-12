export class Prims {
  constructor(adjacencyList) {
    this.adjacencyList = adjacencyList;
    this.nodes = Object.keys(adjacencyList);
    this.steps = [];
  }

  findMinimumSpanningTree(startNode) {
    if (!startNode || !this.adjacencyList[startNode]) {
      startNode = this.nodes[0]; // Default to first node if not provided
    }

    const visited = new Set();
    const mstEdges = [];
    const parents = {};
    
    // Initialize all nodes as not visited
    for (let node of this.nodes) {
      parents[node] = null;
    }
    
    // Start with the first node
    visited.add(startNode);
    
    // Add initial step before adding any edges
    this.steps.push({
      currentNode: startNode,
      addedEdge: null,
      visited: [...visited],
      mstEdges: []
    });
    
    // Continue until all nodes are in the MST
    while (visited.size < this.nodes.length) {
      let minEdge = null;
      let minWeight = Infinity;
      let minSource = null;
      let minTarget = null;
      
      // For each visited node, find the minimum weight edge to an unvisited node
      for (const visitedNode of visited) {
        const neighbors = this.adjacencyList[visitedNode];
        
        for (const { node: neighbor, weight } of neighbors) {
          if (!visited.has(neighbor) && weight < minWeight) {
            minWeight = weight;
            minSource = visitedNode;
            minTarget = neighbor;
            minEdge = { source: visitedNode, target: neighbor, weight };
          }
        }
      }
      
      // If we found an edge, add it to our MST
      if (minEdge) {
        mstEdges.push(minEdge);
        visited.add(minTarget);
        parents[minTarget] = minSource;
        
        // Record this step
        this.steps.push({
          currentNode: minTarget,
          addedEdge: minEdge,
          visited: [...visited],
          mstEdges: [...mstEdges]
        });
      } else {
        alert("Đồ thị không liên thông. Thuật toán không thể tìm được cây khung nhỏ nhất.");
        break;
      }
    }
    
    return { 
      mst: mstEdges, 
      parents, 
      steps: this.steps 
    };
  }
}
