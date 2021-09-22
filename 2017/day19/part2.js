var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = []
let y = 0
let x = 0
let direction = 's'

lineReader.on('line', function (line) {
  map.push(line.split(''))
})

lineReader.on('close', function () {
  let prevChar
  while (prevChar !== '|') {
    prevChar = map[0][x]
    x++
  }
  x--

  let steps = 0

  while (direction) {
    switch (direction) {
      case 'n':
        y--
        break
      case 's':
        y++
        break
      case 'e':
        x++
        break
      case 'w':
        x--
        break
    }
    steps++
    if (!map[y]) {
      break
    }
    const currentChar = map[y][x]

    if (currentChar === undefined || currentChar === ' ') {
      break
    }

    if (currentChar === '+') {
      switch (direction) {
        case 'n':
        case 's':
          direction = map[y][x + 1] ? (map[y][x + 1] === ' ' ? 'w' : 'e') : 'w'
          break
        case 'e':
        case 'w':
          direction = map[y + 1] ? (map[y + 1][x] ? (map[y + 1][x] === ' ' ? 'n' : 's') : 'n') : 'n'
          break
      }
    }
  }
  console.log(steps)
})
