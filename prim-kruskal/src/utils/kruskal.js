import { DisjointSet } from './disjointset';

export class Kruskal {
  constructor(adjacencyList) {
    this.adjacencyList = adjacencyList;
    this.nodes = Object.keys(adjacencyList);
    this.steps = [];
  }
  
  findMinimumSpanningTree() {
    const edges = [];
    const visited = new Set();
    const mstEdges = [];
    const parents = {};

    for (let node of this.nodes) {
      parents[node] = null;
    }

    for (let u of this.nodes) {
      for (let { node: v, weight } of this.adjacencyList[u]) {
        if (u < v) {
          edges.push({ source: u, target: v, weight });
        }
      }
    }

    edges.sort((a, b) => a.weight - b.weight);
    
    const disjointSet = new DisjointSet(this.nodes);

    this.steps.push({
      currentNode: null,
      addedEdge: null,
      visited: [],
      mstEdges: []
    });

    for (let edge of edges) {
      if (!disjointSet.connected(edge.source, edge.target)) {
        mstEdges.push(edge);
        disjointSet.union(edge.source, edge.target);

        visited.add(edge.source);
        visited.add(edge.target);
        
        if (parents[edge.target] === null) {
          parents[edge.target] = edge.source;
        }

        this.steps.push({
          currentNode: edge.target,
          addedEdge: edge,
          visited: [...visited],
          mstEdges: [...mstEdges]
        });

        if (mstEdges.length === this.nodes.length - 1) {
          break;
        }
      }
    }
    
    return { 
      mst: mstEdges, 
      parents, 
      steps: this.steps 
    };
  }
}
