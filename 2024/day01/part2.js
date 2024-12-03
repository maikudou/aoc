const toDecimal = require('../../utils/toDecimal')
const sorter = require('../../utils/numSorter')
const numSorter = require('../../utils/numSorter')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let pairsA = []
let valuesB = new Map()
lineReader.on('line', function (line) {
  let [_, left, right] = /(\d+)\s+(\d+)/.exec(line)
  pairsA.push(left)
  let valueB = toDecimal(right)
  if (valuesB.has(valueB)) {
    valuesB.set(valueB, valuesB.get(valueB) + 1)
  } else {
    valuesB.set(valueB, 1)
  }
})

lineReader.on('close', function () {
  let sortedA = pairsA.map(toDecimal).sort(numSorter)
  console.log(
    sortedA.reduce((acc, value, index) => {
      return acc + (value * valuesB.get(value) || 0)
    }, 0)
  )
})
