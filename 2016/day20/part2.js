var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var rangesStarts = []
var rangesEnds = new Map()

var min = Infinity

lineReader.on('line', function (line) {
  line = line.split('-')
  rangesStarts.push(parseInt(line[0], 10))
  rangesEnds.set(parseInt(line[1], 10), parseInt(line[0], 10))
  min = Math.min(min, line[0])
})

const currentRanges = new Set()

lineReader.on('close', function () {
  rangesStarts.sort(function (a, b) {
    if (a === b) {
      return 0
    }
    return a > b ? 1 : -1
  })

  var rangesEndsArray = Array.from(rangesEnds).sort(function (a, b) {
    if (a[0] === b[0]) {
      return 0
    }
    return a[0] > b[0] ? 1 : -1
  })

  var count = min
  var prevI = -1

  // console.log(rangesStarts, rangesEndsArray, rangesEnds);

  while (rangesStarts.length || rangesEndsArray.length) {
    if (rangesStarts.length && rangesEndsArray.length) {
      if (rangesStarts[0] < rangesEndsArray[0][0]) {
        if (currentRanges.size === 0) {
          count += rangesStarts[0] - prevI - 1
        }
        currentRanges.add(rangesStarts.shift())
      } else {
        prevI = rangesEndsArray[0][0]
        currentRanges.delete(rangesEndsArray.shift()[1])
      }
    } else if (rangesStarts.length) {
      if (currentRanges.size === 0) {
        count += rangesStarts[0] - prevI - 1
      }
      currentRanges.add(rangesStarts.shift())
    } else if (rangesEndsArray.length) {
      prevI = rangesEndsArray[0][0]
      currentRanges.delete(rangesEndsArray.shift()[1])
    }
  }

  count += 4294967295 - prevI

  console.log(count)
})
