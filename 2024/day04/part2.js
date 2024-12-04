var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})
const map = []
lineReader.on('line', function (line) {
  map.push(line.split(''))
})

var xMasCount = 0

lineReader.on('close', function () {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === 'A') {
        if (
          (map[i - 1]?.[j - 1] === 'M' && map[i + 1]?.[j + 1] === 'S') ||
          (map[i + 1]?.[j + 1] === 'M' && map[i - 1]?.[j - 1] === 'S')
        ) {
          if (
            (map[i - 1]?.[j + 1] === 'M' && map[i + 1]?.[j - 1] === 'S') ||
            (map[i + 1]?.[j - 1] === 'M' && map[i - 1]?.[j + 1] === 'S')
          ) {
            xMasCount++
          }
        }
      }
    }
  }
  console.log(xMasCount)
})
