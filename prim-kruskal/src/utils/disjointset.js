export class DisjointSet {
  constructor(elements) {
    this.parent = {};
    this.rank = {};
    
    for (let element of elements) {
      this.parent[element] = element;
      this.rank[element] = 0;
    }
  }
  
  find(element) {
    if (this.parent[element] === element) {
      return element;
    }
    this.parent[element] = this.find(this.parent[element]);
    return this.parent[element];
  }
  
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) return;
    
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
  }
  
  connected(x, y) {
    return this.find(x) === this.find(y);
  }
}
