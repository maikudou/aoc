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

lineReader.on('close', function () {
  let min = Infinity

  crabs.forEach(crab => {
    const sum = crabs.reduce((acc, value) => acc + Math.abs(crab - value), 0)
    min = Math.min(sum, min)
  })
  console.log(min)
})
