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
  const visible = new Set()
  for (let row = 0; row < rows; row++) {
    let lastVisible = -1
    for (let i = 0; i < cols; i++) {
      if (trees[row][i] > lastVisible) {
        lastVisible = trees[row][i]
        visible.add(`${row}|${i}`)
      }
      if (lastVisible === 9) {
        break
      }
    }
    lastVisible = -1
    for (let i = cols - 1; i > -1; i--) {
      if (trees[row][i] > lastVisible) {
        lastVisible = trees[row][i]
        visible.add(`${row}|${i}`)
      }
      if (lastVisible === 9) {
        break
      }
    }
  }
  for (let col = 0; col < cols; col++) {
    let lastVisible = -1
    for (let i = 0; i < rows; i++) {
      if (trees[i][col] > lastVisible) {
        lastVisible = trees[i][col]
        visible.add(`${i}|${col}`)
      }
      if (lastVisible === 9) {
        break
      }
    }
    lastVisible = -1
    for (let i = rows - 1; i > -1; i--) {
      if (trees[i][col] > lastVisible) {
        lastVisible = trees[i][col]
        visible.add(`${i}|${col}`)
      }
      if (lastVisible === 9) {
        break
      }
    }
  }
  console.log(visible.size)
})
