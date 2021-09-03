const { QuickUnion } = require('../../utils/QuickUnion')
const getKnotHash = require('./knotHash')
const input = require('./input')

function getBinary(hash) {
  return hash
    .split('')
    .map(function (hex) {
      var binary = parseInt(hex, 16).toString(2)
      return '0000'.substr(binary.length) + binary
    })
    .join('')
}

var nodes = []
var union = new QuickUnion(16384)

// get the 128x128 grid of 1s and 0s
for (var i = 0; i < 128; i++) {
  var binary = getBinary(getKnotHash(`${input}-${i}`))
    .split('')
    .map(Number)
  nodes = nodes.concat(binary)
}

for (var i = 0; i < 16384; i++) {
  if (nodes[i]) {
    // connect filled node to the right
    if ((i + 1) % 128 && nodes[i + 1]) {
      union.union(i, i + 1)
    }
    // connect node below
    if (nodes[i + 128]) {
      union.union(i, i + 128)
    }
  }
}

var roots = new Set()

for (var i = 0; i < 16384; i++) {
  if (nodes[i]) {
    roots.add(union.root(i))
  }
}

console.log(roots.size)
