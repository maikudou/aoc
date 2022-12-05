const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let pairCount = 0
lineReader.on('line', function (line) {
  let [_, startA, endA, startB, endB] = /(\d+)-(\d+),(\d+)-(\d+)/.exec(line)
  startA = toDecimal(startA)
  endA = toDecimal(endA)
  startB = toDecimal(startB)
  endB = toDecimal(endB)
  if ((startA <= endB && endA >= endB) || (startB <= endA && endB >= endA)) {
    pairCount++
  }
})

lineReader.on('close', function () {
  console.log(pairCount)
})
