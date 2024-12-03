const toDecimal = require('../../utils/toDecimal')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var safeCount = 0
lineReader.on('line', function (line) {
  let levels = line.split(' ').map(toDecimal)
  if (
    levels.every((value, index, array) => {
      if (index === 0) return true
      let difference = value - array[index - 1]
      if (index === 1) {
        return Math.abs(difference) !== 0 && Math.abs(difference) <= 3
      }
      if (
        difference === 0 ||
        (difference < 0 && array[index - 1] - array[index - 2] > 0) ||
        (difference > 0 && array[index - 1] - array[index - 2] < 0)
      ) {
        return false
      }
      return Math.abs(difference) <= 3
    })
  ) {
    safeCount++
  }
})

lineReader.on('close', function () {
  console.log(safeCount)
})
