import { Edge, Instance } from './types';
// Disjoint set data structure
class DSU {
    private parent: number[];
    private rank: number[];

    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = Array(n).fill(1);
    }

    find(i: number): number {
        if (this.parent[i] !== i) {
            this.parent[i] = this.find(this.parent[i]);
        }
        return this.parent[i];
    }

    unite(x: number, y: number): void {
        const s1 = this.find(x);
        const s2 = this.find(y);
        if (s1 !== s2) {
            if (this.rank[s1] < this.rank[s2]) this.parent[s1] = s2;
            else if (this.rank[s1] > this.rank[s2]) this.parent[s2] = s1;
            else {
                this.parent[s2] = s1;
                this.rank[s1]++;
            }
        }
    }
}
function kruskalsMST(V: number, edges: Edge[]): number {
    
    // Sort all edges
    edges.sort((a, b) => a.weight - b.weight);
    
    // Traverse edges in sorted order
    const dsu = new DSU(V);
    let cost = 0;
    let count = 0;
    for (const edge of edges) {
        
        // Make sure that there is no cycle
        if (dsu.find(edge.node1) !== dsu.find(edge.node2)) {
            dsu.unite(edge.node1, edge.node2);
            cost += edge.weight;
            if (++count === V - 1) break;
        }
    }
    return cost;
}



// Example using the Edge interface
const exampleInstance: Instance = {
    edges: [
        { node1: 0, node2: 1, weight: 10 },
        { node1: 1, node2: 3, weight: 15 },
        { node1: 2, node2: 3, weight: 4 },
        { node1: 2, node2: 0, weight: 6 },
        { node1: 0, node2: 3, weight: 5 }
    ],
    numNodes: 4
};

console.log(kruskalsMST(exampleInstance.numNodes, exampleInstance.edges));

// Export for use in other files
export { kruskalsMST, DSU };
