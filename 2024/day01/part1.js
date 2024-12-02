const toDecimal = require('../../utils/toDecimal')
const sorter = require('../../utils/numSorter')
const numSorter = require('../../utils/numSorter')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let pairsA = []
let pairsB = []
lineReader.on('line', function (line) {
  let [_, left, right] = /(\d+)\s+(\d+)/.exec(line)
  pairsA.push(left)
  pairsB.push(right)
})

lineReader.on('close', function () {
  let sortedA = pairsA.map(toDecimal).sort(numSorter)
  let sortedB = pairsB.map(toDecimal).sort(numSorter)
  console.log(sortedA.reduce((acc, value, index) => {
    return acc + Math.abs(value - sortedB[index])
  }, 0))
})
