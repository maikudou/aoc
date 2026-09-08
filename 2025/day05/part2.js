const toDecimal = require('../../utils/toDecimal')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let idsMode = false

const ranges = []
const ids = []

lineReader.on('line', function (line) {
  if (!line) {
    idsMode = true
    return
  }
  if (idsMode) {
    ids.push(toDecimal(line))
  } else {
    ranges.push(line.split('-').map(toDecimal))
  }
})

lineReader.on('close', function () {
  const mergedRanges = ranges
    .sort((a, b) => {
      return a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]
    })
    .reduce((acc, value, index) => {
      if (acc.length === 0) {
        acc.push(value)
        return acc
      }
      if (acc[acc.length - 1][1] >= value[0] && acc[acc.length - 1][1] <= value[1]) {
        acc[acc.length - 1][1] = value[1]
      } else {
        if (acc[acc.length - 1][0] > value[0] || acc[acc.length - 1][1] < value[1]) {
          acc.push(value)
        }
      }
      return acc
    }, [])
  console.log(
    mergedRanges.reduce((acc, value) => {
      return acc + value[1] - value[0] + 1
    }, 0)
  )
})
