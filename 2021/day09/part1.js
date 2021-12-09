const toDecimal = require('../../utils/toDecimal')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = []

lineReader.on('line', function (line) {
  map.push(line.split('').map(toDecimal))
})

lineReader.on('close', function () {
  console.log(
    map.reduce((acc, row, rowIndex) => {
      return (
        acc +
        row.reduce((acc, column, columnIndex) => {
          if (
            (rowIndex == 0 ||
              map[rowIndex - 1][columnIndex] == undefined ||
              map[rowIndex - 1][columnIndex] > column) &&
            (map[rowIndex][columnIndex - 1] == undefined ||
              map[rowIndex][columnIndex - 1] > column) &&
            (map[rowIndex][columnIndex + 1] == undefined ||
              map[rowIndex][columnIndex + 1] > column) &&
            (map[rowIndex + 1] == undefined ||
              map[rowIndex + 1][columnIndex] == undefined ||
              map[rowIndex + 1][columnIndex] > column)
          ) {
            acc += column + 1
          }
          return acc
        }, 0)
      )
    }, 0)
  )
})
