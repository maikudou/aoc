var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let map = new Map()

const flip = (x, y) => {
  const tile = map.get(`${x}|${y}`) || {
    x,
    y,
    flipped: false
  }
  tile.flipped = !tile.flipped
  map.set(`${x}|${y}`, tile)
}

let x = 0
let y = 0

lineReader.on('line', function (line) {
  x = 0
  y = 0
  line = line.split('')
  let direction
  while (line.length) {
    direction = line.shift()
    if (direction == 's' || direction == 'n') {
      direction += line.shift()
    }
    switch (direction) {
      case 'e':
        x += 1
        break
      case 'se':
        x += 0.5
        y += 0.5
        break
      case 'sw':
        x -= 0.5
        y += 0.5
        break
      case 'w':
        x -= 1
        break
      case 'nw':
        x -= 0.5
        y -= 0.5
        break
      case 'ne':
        x += 0.5
        y -= 0.5
        break
    }
  }
  flip(x, y)
})

lineReader.on('close', function () {
  console.log(
    Array.from(map.values()).reduce((acc, value) => {
      acc += value.flipped ? 1 : 0
      return acc
    }, 0)
  )
})
