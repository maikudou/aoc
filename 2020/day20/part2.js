var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const tiles = new Map()
const sides = new Map()
let currentTile

flipMapX = array => array.slice().reverse()
flipMapY = array => array.map(row => row.slice().reverse())
rotateMap = array =>
  array.reduce((acc, value) => {
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
    map: flipMapX(tile.map)
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
    map: flipMapY(tile.map)
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
    map: rotateMap(tile.map)
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

  // console.log(tile.id, tile.sides, top, left)

  if (top) {
    if (tile.sides.n == top) {
      goodN = true
    }
    if (tile.sides.s == top) {
      goodS = true
    }
    if (tile.sides.n.split('').reverse().join('') == top) {
      goodNR = true
    }
    if (tile.sides.s.split('').reverse().join('') == top) {
      goodSR = true
    }
  } else {
    if (sides.get(tile.sides.n).length == 1) {
      goodN = true
    }
    if (sides.get(tile.sides.s).length == 1) {
      goodS = true
    }
  }
  if (left) {
    if (tile.sides.w == left) {
      goodW = true
    }
    if (tile.sides.e == left) {
      goodE = true
    }
    if (tile.sides.w.split('').reverse().join('') == left) {
      goodWR = true
    }
    if (tile.sides.e.split('').reverse().join('') == left) {
      goodER = true
    }
  } else {
    if (sides.get(tile.sides.w).length == 1) {
      goodW = true
    }
    if (sides.get(tile.sides.e).length == 1) {
      goodE = true
    }
  }

  // console.log(goodN, goodW, goodS, goodE, goodNR, goodWR, goodSR, goodER)

  if (goodS && (goodWR || goodW)) {
    return flipX(tile)
  }
  if (goodE && goodNR) {
    return flipY(tile)
  }
  if (goodSR && goodER) {
    return rotate(rotate(tile))
  }
  if (goodN && goodW) {
    return tile
  } else {
    return fit(rotate(tile), top, left)
  }
}

const buildImage = map => {
  return map.reduce((image, row) => {
    const rowImage = row.reduce((rowImage, tile) => {
      rowImage = tile.map.reduce((tileImage, tileRow, index, array) => {
        if (!index || index == array.length - 1) {
          return rowImage
        }
        if (!rowImage[index - 1]) {
          rowImage[index - 1] = []
        }
        rowImage[index - 1] = rowImage[index - 1].concat(tileRow.slice(1, -1))
      }, rowImage)
      return rowImage
    }, [])
    image = image.concat(rowImage)
    return image
  }, [])
}

const findMonsters = image => {
  let monstersCount = 0
  for (var y = 1; y < image.length - 1; y++) {
    for (var x = 0; x < image[0].length - 20; x++) {
      if (
        image[y][x] == '#' &&
        image[y + 1][x + 1] == '#' &&
        image[y + 1][x + 4] == '#' &&
        image[y][x + 5] == '#' &&
        image[y][x + 6] == '#' &&
        image[y + 1][x + 7] == '#' &&
        image[y + 1][x + 10] == '#' &&
        image[y][x + 11] == '#' &&
        image[y][x + 12] == '#' &&
        image[y + 1][x + 13] == '#' &&
        image[y + 1][x + 16] == '#' &&
        image[y][x + 17] == '#' &&
        image[y][x + 18] == '#' &&
        image[y][x + 19] == '#' &&
        image[y - 1][x + 18] == '#'
      ) {
        monstersCount++
      }
    }
  }
  return monstersCount
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

  const finalTileMap = [[fit(tiles.get(firstCorner))]]
  const side = Math.sqrt(tiles.size)
  for (var y = 0; y < side; y++) {
    for (var x = 0; x < side - 1; x++) {
      if (!finalTileMap[y]) {
        let setTile = finalTileMap[y - 1][0]
        let nextTiles = sides.get(setTile.sides.s).filter(id => id != setTile.id)
        if (nextTiles.size > 1) {
          console.log('Something wrong! Too many possibilities')
          process.exit(1)
        }
        finalTileMap.push([fit(tiles.get(nextTiles[0]), setTile.sides.s)])
      }
      let setTile = finalTileMap[y][x]
      let nextTiles = sides.get(setTile.sides.e).filter(id => id != setTile.id)
      if (nextTiles.length > 1) {
        console.log('Something wrong! Too many possibilities')
        process.exit(1)
      }
      if (!nextTiles.length) {
        console.log('Something wrong! No possible tiles')
        process.exit(1)
      }
      finalTileMap[y].push(
        fit(
          tiles.get(nextTiles[0]),
          finalTileMap[y - 1]
            ? finalTileMap[y - 1][x + 1]
              ? finalTileMap[y - 1][x + 1].sides.s
              : false
            : false,
          setTile.sides.e
        )
      )
    }
  }
  let image = buildImage(finalTileMap)
  let monstersCount = 0
  const actions = [
    rotateMap,
    rotateMap,
    rotateMap,
    flipMapX,
    rotateMap,
    flipMapX,
    rotateMap,
    flipMapY,
    rotateMap,
    flipMapY
  ]
  while (monstersCount == 0 && actions.length) {
    monstersCount = findMonsters(image)
    let action = actions.shift()
    image = action(image)
  }
  console.log(
    image.reduce((acc, value) => {
      return (
        acc +
        value.reduce((lineAcc, cell) => {
          return lineAcc + (cell == '#' ? 1 : 0)
        }, 0)
      )
    }, 0) -
      monstersCount * 15
  )
})
