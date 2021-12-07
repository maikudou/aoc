const toDecimal = require('../../utils/toDecimal')

let crabs

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

lineReader.on('line', function (line) {
  crabs = line
    .split(',')
    .map(toDecimal)
    .sort((a, b) => a - b)
})

const map = new Map()
map.set(0, 0)
map.set(1, 1)

const factorial = function (num) {
  const sum = map.has(num) ? map.get(num) : num + factorial(num - 1)
  map.set(num, sum)
  return sum
}

lineReader.on('close', function () {
  let min = Infinity

  for (var i = crabs[0]; i < crabs[crabs.length - 1]; i++) {
    const sum = crabs.reduce((acc, value) => acc + factorial(Math.abs(i - value)), 0)
    min = Math.min(sum, min)
  }
  console.log(min)
})
