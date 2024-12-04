var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = []

lineReader.on('line', function (line) {
  map.push(line.split(''))
})

var wordCount = 0

lineReader.on('close', function () {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === 'X') {
        if (
          i <= map.length - 4 &&
          map[i + 1][j] === 'M' &&
          map[i + 2][j] === 'A' &&
          map[i + 3][j] === 'S'
        ) {
          wordCount++
        }
        if (i >= 3 && map[i - 1][j] === 'M' && map[i - 2][j] === 'A' && map[i - 3][j] === 'S') {
          wordCount++
        }
        if (
          j <= map[i].length - 3 &&
          map[i][j + 1] === 'M' &&
          map[i][j + 2] === 'A' &&
          map[i][j + 3] === 'S'
        ) {
          wordCount++
        }
        if (j >= 3 && map[i][j - 1] === 'M' && map[i][j - 2] === 'A' && map[i][j - 3] === 'S') {
          wordCount++
        }
        if (
          map[i + 1]?.[j + 1] === 'M' &&
          map[i + 2]?.[j + 2] === 'A' &&
          map[i + 3]?.[j + 3] === 'S'
        ) {
          wordCount++
        }
        if (
          map[i + 1]?.[j - 1] === 'M' &&
          map[i + 2]?.[j - 2] === 'A' &&
          map[i + 3]?.[j - 3] === 'S'
        ) {
          wordCount++
        }
        if (
          map[i - 1]?.[j + 1] === 'M' &&
          map[i - 2]?.[j + 2] === 'A' &&
          map[i - 3]?.[j + 3] === 'S'
        ) {
          wordCount++
        }
        if (
          map[i - 1]?.[j - 1] === 'M' &&
          map[i - 2]?.[j - 2] === 'A' &&
          map[i - 3]?.[j - 3] === 'S'
        ) {
          wordCount++
        }
      }
    }
  }
  console.log(wordCount)
})
