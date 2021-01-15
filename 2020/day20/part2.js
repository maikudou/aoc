var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/test')
})

const tiles = new Map()
const sides = new Map()
let currentTile

// Flip along x axis
const flipX = tile => {
  return {
    id: tile.id,
    sides: {
      n: tile.sides.s,
      s: tile.sides.n,
      w: tile.sides.w.split('').reverse().join(''),
      e: tile.sides.e.split('').reverse().join('')
    },
    map: tile.map.slice().reverse()
  }
}

// Flip along y axis
const flipY = tile => {
  return {
    id: tile.id,
    sides: {
      n: tile.sides.n.split('').reverse().join(''),
      s: tile.sides.s.split('').reverse().join(''),
      w: tile.sides.e,
      e: tile.sides.w
    },
    map: tile.map.map(row => row.slice().reverse())
  }
}

// rotate right 90 degrees
const rotate = tile => {
  return {
    id: tile.id,
    sides: {
      n: tile.sides.w.split('').reverse().join(''),
      s: tile.sides.e.split('').reverse().join(''),
      w: tile.sides.s,
      e: tile.sides.n
    },
    map: tile.map.reduce((acc, value) => {
      if (acc.length == 0) {
        value.map(val => {
          acc.push([val])
        })
      } else {
        value.map((value, index) => {
          acc[index].unshift(value)
        })
      }
      return acc
    }, [])
  }
}

const analyzeTile = tile => {
  return tile.map.reduce((acc, value, index, array) => {
    if (index === 0) {
      tile.sides = {
        n: value.join(''),
        s: null,
        w: [value[0]],
        e: [value[value.length - 1]]
      }
    } else if (index === array.length - 1) {
      tile.sides.s = value.join('')
      tile.sides.w.push(value[0])
      tile.sides.w = tile.sides.w.join('')
      tile.sides.e.push(value[value.length - 1])
      tile.sides.e = tile.sides.e.join('')

      sides.set(tile.sides.n, (sides.get(tile.sides.n) || []).concat(tile.id))
      sides.set(
        tile.sides.n.split('').reverse().join(''),
        (sides.get(tile.sides.n.split('').reverse().join('')) || []).concat(tile.id)
      )
      sides.set(tile.sides.s, (sides.get(tile.sides.s) || []).concat(tile.id))
      sides.set(
        tile.sides.s.split('').reverse().join(''),
        (sides.get(tile.sides.s.split('').reverse().join('')) || []).concat(tile.id)
      )
      sides.set(tile.sides.w, (sides.get(tile.sides.w) || []).concat(tile.id))
      sides.set(
        tile.sides.w.split('').reverse().join(''),
        (sides.get(tile.sides.w.split('').reverse().join('')) || []).concat(tile.id)
      )
      sides.set(tile.sides.e, (sides.get(tile.sides.e) || []).concat(tile.id))
      sides.set(
        tile.sides.e.split('').reverse().join(''),
        (sides.get(tile.sides.e.split('').reverse().join('')) || []).concat(tile.id)
      )
    } else {
      tile.sides.w.push(value[0])
      tile.sides.e.push(value[value.length - 1])
    }
    return tile
  }, tile)
}

const fit = (tile, top, left) => {
  let goodN = false
  let goodW = false
  let goodS = false
  let goodE = false
  let goodNR = false
  let goodWR = false
  let goodSR = false
  let goodER = false

  if (top) {
    if (sides.get(tile.sides.n).indexOf(top) > -1) {
      goodN = true
    }
    if (sides.get(tile.sides.s).indexOf(top) > -1) {
      goodS = true
    }
  }
  if (left) {
    if (sides.get(tile.sides.w).indexOf(left) > -1) {
      goodW = true
    }
    if (sides.get(tile.sides.e).indexOf(top) > -1) {
      goodE = true
    }
  }
}

lineReader.on('line', function (line) {
  if (line) {
    const [_, id] = /^(?:Tile (\d+)\:)|[\.#]+$/.exec(line)
    if (id) {
      currentTile = {
        id,
        map: []
      }
    } else {
      currentTile.map.push(line.split(''))
    }
  } else {
    tiles.set(currentTile.id, analyzeTile(currentTile))
    currentTile = null
  }
})

lineReader.on('close', function () {
  tiles.set(currentTile.id, analyzeTile(currentTile))
  const iterator = tiles.keys()
  let next = iterator.next()
  let firstCorner
  while (!next.done) {
    let possibleNeigbours = new Set()
    const tile = tiles.get(next.value)
    Object.keys(tile.sides).map(key => {
      sides.get(tile.sides[key]).map(tile => {
        possibleNeigbours.add(tile)
      })
    })
    next = iterator.next()
    if (possibleNeigbours.size === 3) {
      firstCorner = tile.id
      break
    }
  }

  const finalTileMap = [[tiles.get(firstCorner)]]
  const side = Math.sqrt(tiles.size)
  for (var y = 0; y < side; y++) {
    for (var x = 0; x < side - 1; x++) {
      // first iteration of a new row
      if (!finalTileMap[y]) {
      } else {
        let setTile = finalTileMap[y][x]

        // First corner
        if (y == 0 && x == 0) {
          let flipCurrentX = false
          let flipCurrentY = false
          if (sides.has(setTile.sides.n) && sides.get(setTile.sides.n).size > 1) {
            flipCurrentX = true
          }
          if (sides.has(setTile.sides.w) && sides.get(setTile.sides.w).size > 1) {
            flipCurrentY = true
          }
          if (flipCurrentX) {
            setTile = flipX(setTile)
          }
          if (flipCurrentY) {
            setTile = flipY(setTile)
          }
          // console.log(flipCurrentX, flipCurrentY, setTile)
        }

        let nextTiles = sides.get(setTile.sides.e).filter(id => id != setTile.id)
        if (nextTiles.size > 1) {
          console.log('Something wrong!')
          process.exit(1)
        }
        let nextTile = tiles.get(nextTiles[0])
        console.log(nextTile)
      }
    }
  }
})
