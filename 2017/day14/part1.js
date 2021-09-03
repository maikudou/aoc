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

var used = 0

for (var i = 0; i < 128; i++) {
  var binary = getBinary(getKnotHash(`${input}-${i}`))
  used += binary
    .split('')
    .map(Number)
    .reduce((prev, next) => prev + next, 0)
}

console.log(used)
