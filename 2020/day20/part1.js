var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const tiles = new Map()
const sides = new Map()
let currentTile

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

let product = 1

lineReader.on('close', function () {
  tiles.set(currentTile.id, analyzeTile(currentTile))
  const iterator = tiles.keys()
  let next = iterator.next()
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
      product *= parseInt(tile.id, 10)
    }
  }
  console.log(product)
})
