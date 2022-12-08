const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const trees = []

lineReader.on('line', function (line) {
  trees.push(line.split('').map(toDecimal))
})

lineReader.on('close', function () {
  // console.log(trees)
  const cols = trees[0].length
  const rows = trees.length
  let best = 0
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tree = trees[row][col]
      let vd = 1
      let count = 0
      let i = col + 1
      while (i < cols) {
        count++
        if (trees[row][i] >= tree) {
          break
        }
        i++
      }
      if (count === 0) {
        continue
      }
      vd *= count
      count = 0
      i = col - 1
      while (i > -1) {
        count++
        if (trees[row][i] >= tree) {
          break
        }
        i--
      }
      if (count === 0) {
        continue
      }
      vd *= count
      count = 0
      i = row + 1
      while (i < rows) {
        count++
        if (trees[i][col] >= tree) {
          break
        }
        i++
      }
      if (count === 0) {
        continue
      }
      vd *= count
      count = 0
      i = row - 1
      while (i > -1) {
        count++
        if (trees[i][col] >= tree) {
          break
        }
        i--
      }
      vd *= count
      best = Math.max(best, vd)
    }
  }
  console.log(best)
})
