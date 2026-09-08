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
    ids.reduce((acc, value) => {
      let l = 0
      let r = mergedRanges.length - 1
      while (l <= r) {
        const ind = l + Math.floor((r - l) / 2)
        if (mergedRanges[ind][1] < value) {
          l = ind + 1
        } else if (mergedRanges[ind][0] > value) {
          r = ind - 1
        } else {
          acc++
          break
        }
      }
      return acc
    }, 0)
  )
})
