export interface Edge {
  node1: number;
  node2: number;
  weight: number;
}
export interface Instance {
  edges: Edge[];
  // nodes: number[];
  numNodes: number;
}