import { Instance } from "./types";

export class PriorityQueue {
  public heap: [number, number][];

  constructor() {
    this.heap = [];
  }

  enqueue(value: [number, number]) {
    this.heap.push(value);
    let i = this.heap.length - 1;
    while (i > 0) {
      const j: number = Math.floor((i - 1) / 2);
      if (this.heap[i][0] >= this.heap[j][0]) {
        break;
      }
      [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
      i = j;
    }
  }

  dequeue() {
    if (this.heap.length === 0) {
      throw new Error("Queue is empty");
    }
    let i = this.heap.length - 1;
    const result = this.heap[0];
    this.heap[0] = this.heap[i];
    this.heap.pop();

    i--;
    let j = 0;
    while (true) {
      const left = j * 2 + 1;
      if (left > i) {
        break;
      }
      const right = left + 1;
      let k = left;
      if (right <= i && this.heap[right][0] < this.heap[left][0]) {
        k = right;
      }
      if (this.heap[j][0] <= this.heap[k][0]) {
        break;
      }
      [this.heap[j], this.heap[k]] = [this.heap[k], this.heap[j]];
      j = k;
    }

    return result;
  }

  get count() {
    return this.heap.length;
  }
}

export function spanningTree(instance: Instance) {
    const V = instance.numNodes;
    const E = instance.edges.length;
  // Create an adjacency list representation of the graph
  const adj: [number, number][][] = new Array(V).fill(null).map(() => []);

  // Fill the adjacency list with edges and their weights
  for (let i = 0; i < E; i++) {
    const { node1: u, node2: v, weight: wt } = instance.edges[i];
    adj[u].push([v, wt]);
    adj[v].push([u, wt]);
  }

  // Create a priority queue to store edges with their weights
  const pq = new PriorityQueue();

  // Create a visited array to keep track of visited vertices
  const visited = new Array(V).fill(false);

  // Variable to store the result (sum of edge weights)
  let res = 0;

  // Start with vertex 0
  pq.enqueue([0, 0]);

  // Perform Prim's algorithm to find the Minimum Spanning Tree
  while (pq.count > 0) {
    const p = pq.dequeue();

    const wt = p[0]; // Weight of the edge
    const u = p[1]; // Vertex connected to the edge

    if (visited[u]) {
      continue; // Skip if the vertex is already visited
    }

    res += wt; // Add the edge weight to the result
    visited[u] = true; // Mark the vertex as visited

    // Explore the adjacent vertices
    for (const v of adj[u]) {
      // v[0] represents the vertex and v[1] represents the edge weight
      if (!visited[v[0]]) {
        pq.enqueue([v[1], v[0]]); // Add the adjacent edge to the priority queue
      }
    }
  }

  return res;
}

// const graph = [[0, 1, 5], [1, 2, 3], [0, 2, 1]];
// console.log(spanningTree(3, 3, graph));
