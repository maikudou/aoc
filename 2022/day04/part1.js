const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let pairCount = 0
lineReader.on('line', function (line) {
  const [_, startA, endA, startB, endB] = /(\d+)-(\d+),(\d+)-(\d+)/.exec(line)
  if (
    (toDecimal(startA) >= toDecimal(startB) && toDecimal(endA) <= toDecimal(endB)) ||
    (toDecimal(startB) >= toDecimal(startA) && toDecimal(endB) <= toDecimal(endA))
  ) {
    pairCount++
  }
})

lineReader.on('close', function () {
  console.log(pairCount)
})
