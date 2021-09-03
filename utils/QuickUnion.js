module.exports = {
  QuickUnion: class QuickUnion {
    constructor(N) {
      this.id = new Array(N)
      this.size = new Array(N)

      for (let i = 0; i < N; i++) {
        this.id[i] = i
        this.size[i] = 1
      }
    }

    root(i) {
      while (i != this.id[i]) {
        i = this.id[i]
      }

      return i
    }

    connected(p, q) {
      return this.root(p) == this.root(q)
    }

    union(p, q) {
      let pRoot = this.root(p)
      let qRoot = this.root(q)

      if (pRoot == qRoot) {
        return
      }

      if (this.size[pRoot] < this.size[qRoot]) {
        this.id[pRoot] = qRoot
        this.size[qRoot] += this.size[pRoot]
      } else {
        this.id[qRoot] = pRoot
        this.size[pRoot] += this.size[qRoot]
      }
    }
  }
}
