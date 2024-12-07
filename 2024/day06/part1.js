var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = []
let row = 0
let guard = null
let x
let y

lineReader.on('line', function (line) {
  map.push(line.split(''))
  if (!guard) {
    const guardHere = line.indexOf('^')
    if (guardHere > -1) {
      guard = `${row}|${guardHere}`
      x = guardHere
      y = row
    }
  }
  row++
})

lineReader.on('close', function () {
  const width = map[0].length
  const height = map.length
  let dir = 0
  const visited = new Set()
  while (x > -1 && x < width && y > -1 && y < height) {
    visited.add(`${x}|${y}`)
    if (dir === 0) {
      if (y > 0) {
        if (map[y - 1][x] === '#') {
          dir = 1
        } else {
          y--
        }
      } else {
        y--
      }
    } else if (dir === 1) {
      if (x < width - 1) {
        if (map[y][x + 1] === '#') {
          dir = 2
        } else {
          x++
        }
      } else {
        x++
      }
    } else if (dir === 2) {
      if (y < height - 1) {
        if (map[y + 1][x] === '#') {
          dir = 3
        } else {
          y++
        }
      } else {
        y++
      }
    } else {
      if (x > 0) {
        if (map[y][x - 1] === '#') {
          dir = 0
        } else {
          x--
        }
      } else {
        x--
      }
    }
  }
  console.log(visited.size)
})