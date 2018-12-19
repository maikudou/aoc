class QuickUnion {
    constructor (N) {
        this.id = new Array(N);
        this.size = new Array(N);

        for (let i = 0; i < N; i++) {
            this.id[i] = i;
            this.size[i] = 1;
        }
    }

    root (i){
        if (i != this.id[i]) {
            i = this.id[i];
        }

        return i;
    }

    connected(p, q){
        return this.root(p) == this.root(q);
    }

    union(p, q){
        let pRoot = this.root(p);
        let qRoot = this.root(q);

        if (pRoot == qRoot) {
            return;
        }

        if (this.size[pRoot] < this.size[qRoot]) {
            this.id[pRoot] = qRoot;
            this.size[qRoot] += this.size[pRoot];
        } else {
            this.id[qRoot] = pRoot;
            this.size[pRoot] += this.size[qRoot];
        }
    }
}


function getKnotHash(input) {
    input = input.split("").map(function(string){
        return string.codePointAt();
    }).concat([17, 31, 73, 47, 23]);

    var nodes = [];
    for (var i = 0; i<256; i++) {
        nodes.push(i);
    }

    var pos = 0;
    var replacePos;
    var skip = 0;
    var length;
    var selected;
    var change;

    for (var round = 0; round < 64; round++) {
        for (var i = 0; i < input.length; i++) {
            length = input[i];
            if (length > nodes.length) {
                continue;
            }
            change =  pos + length - nodes.length;
            selected = nodes.slice(pos, pos + length);

            if (change > 0) {
                selected = selected.concat(nodes.slice(0, change));
            }
            selected.reverse();

            if (pos >= nodes.length ) {
                console.log(pos);
            }

            replacePos = pos;
            for (var j = 0; j < selected.length; j++) {
                if (replacePos == nodes.length) {
                    replacePos = 0;
                }

                if (replacePos >= nodes.length ) {
                    // console.log(replacePos);
                }

                nodes[replacePos] = selected[j];

                replacePos++;
            }

            pos += length + skip;

            while (pos >= nodes.length) {
                pos = pos - nodes.length;
            }

            skip++;
        }
    }

    var sparse = [];
    var xored;
    for (i = 0; i < 16; i++) {
        xored = 0;
        for (k = 0; k < 16; k++) {
            xored = xored ^ nodes[16*i+k];
        }
        if (xored > 15) {
            sparse.push(xored.toString(16));
        } else {
            sparse.push("0" + xored.toString(16));
        }
    }
    return sparse.join("");
}

function getBinary (hash) {
    return hash.split("").map(function(hex){
        var binary = parseInt(hex, 16).toString(2);
        return "0000".substr(binary.length)+binary
    }).join("");
}

var nodes = [];
var union = new QuickUnion(128*128);

for(var i=0; i<128; i++) {
    var binary = getBinary(getKnotHash("flqrgnkx-"+i)).split("").map(Number);
    nodes = nodes.concat(binary);
}

for(var i=0; i<16384; i++) {
    if (nodes[i]) {
        if ((i + 1)%128 && nodes[i+1]) {
            union.union(i, i+1);
        }
        if (i < 16384 - 128 && nodes[i]) {
            union.union(i, i+128);
        }
    }
}

var roots = {};

for(var i=0; i<16384; i++) {
    if (nodes[i]) {
        roots[union.root(i)] = true;
    }
}

console.log(Object.keys(roots).length);

