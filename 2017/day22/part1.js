var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let y = 0
const grid = new Set()
let size

lineReader.on('line', function (line) {
  size = line.length
  line.split('').forEach((cell, x) => {
    if (cell === '#') {
      grid.add(`${x}|${y}`)
    }
  })
  y--
})

lineReader.on('close', function () {
  y = -Math.floor(size / 2)
  x = -y
  let dir = 'n'

  let counter = 0
  for (let b = 0; b < 10000; b++) {
    if (grid.has(`${x}|${y}`)) {
      dir = dir == 'n' ? 'e' : dir == 'e' ? 's' : dir == 's' ? 'w' : 'n'
      grid.delete(`${x}|${y}`)
    } else {
      counter++
      dir = dir == 'n' ? 'w' : dir == 'w' ? 's' : dir == 's' ? 'e' : 'n'
      grid.add(`${x}|${y}`)
    }
    switch (dir) {
      case 'n':
        y++
        break
      case 'e':
        x++
        break
      case 's':
        y--
        break
      case 'w':
        x--
        break
    }
  }

  console.log(counter)
})
