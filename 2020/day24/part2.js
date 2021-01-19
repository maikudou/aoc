var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let map = new Map()
const nbs = [
  [-1, 0],
  [-0.5, -0.5],
  [0.5, -0.5],
  [1, 0],
  [0.5, 0.5],
  [-0.5, 0.5]
]

const flip = (x, y, map) => {
  const tile = map.get(`${x}|${y}`) || {
    x,
    y,
    flipped: false
  }
  tile.flipped = !tile.flipped
  map.set(`${x}|${y}`, tile)

  nbs.forEach(value => {
    if (!map.has(`${x + value[0]}|${y + value[1]}`)) {
      map.set(`${x + value[0]}|${y + value[1]}`, {
        x: x + value[0],
        y: y + value[1],
        flipped: false
      })
    }
  })
}

const getFlippedNeigbors = (x, y, map) => {
  return nbs.reduce((acc, value) => {
    const nb = map.get(`${x + value[0]}|${y + value[1]}`)
    if (nb && nb.flipped) {
      acc += 1
    }
    return acc
  }, 0)
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
  flip(x, y, map)
})

lineReader.on('close', function () {
  for (var i = 0; i < 100; i++) {
    let newMap = new Map()
    Array.from(map.values()).forEach(value => {
      let nextValue = { ...value }
      const flipped = nextValue.flipped
      const flippedNeighbors = getFlippedNeigbors(nextValue.x, nextValue.y, map)
      newMap.set(`${nextValue.x}|${nextValue.y}`, nextValue)
      if (flipped && (flippedNeighbors == 0 || flippedNeighbors > 2)) {
        nextValue.flipped = false
      } else if (!flipped && flippedNeighbors == 2) {
        flip(nextValue.x, nextValue.y, newMap)
      }
    })

    map = newMap
  }
  console.log(
    Array.from(map.values()).reduce((acc, value) => {
      acc += value.flipped ? 1 : 0
      return acc
    }, 0)
  )
})
