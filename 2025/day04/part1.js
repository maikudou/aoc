var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let width = 0
const map = []

lineReader.on('line', function (line) {
  width = line.length
  map.push(line.split('').map(a => a === '@'))
})

let count = 0

lineReader.on('close', function () {
  console.log(
    map.reduce(
      (count, row, rowIndex) =>
        row.reduce((count, cell, cellIndex) => {
          if (!map[rowIndex][cellIndex]) {
            return count
          }
          let localCount = 0
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i === 0 && j === 0) {
                continue
              }
              if (map[rowIndex + i]?.[cellIndex + j]) {
                localCount++
              }
            }
          }
          if (localCount < 4) {
            return count + 1
          }
          return count
        }, count),
      0
    )
  )
})
