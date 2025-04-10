import { spanningTree } from './prims';
import { Instance } from './types';

// Create a test instance representing a graph
const testInstance: Instance = {
  numNodes: 5,
  edges: [
    { node1: 0, node2: 1, weight: 2 },
    { node1: 0, node2: 3, weight: 6 },
    { node1: 1, node2: 2, weight: 3 },
    { node1: 1, node2: 3, weight: 8 },
    { node1: 1, node2: 4, weight: 5 },
    { node1: 2, node2: 4, weight: 7 },
    { node1: 3, node2: 4, weight: 9 }
  ]
};

// Run the Prim's algorithm on the test instance
const minimumSpanningTreeWeight = spanningTree(testInstance);
console.log(`Minimum Spanning Tree Weight: ${minimumSpanningTreeWeight}`);

// Expected result: The MST should have weight 17 (edges 0-1, 1-2, 0-3, 1-4)
