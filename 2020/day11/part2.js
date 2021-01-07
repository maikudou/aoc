var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let map = []

const getNeigborsCount = (row, column) => {
  const columnCount = map[0].length
  let count = 0
  const toCheck = new Set(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'])

  let dist = 1
  while (toCheck.size) {
    if (row - dist < 0) {
      toCheck.delete('N')
      toCheck.delete('NW')
      toCheck.delete('NE')
    }
    if (row + dist >= map.length) {
      toCheck.delete('S')
      toCheck.delete('SW')
      toCheck.delete('SE')
    }
    if (column - dist < 0) {
      toCheck.delete('W')
      toCheck.delete('NW')
      toCheck.delete('SW')
    }
    if (column + dist >= columnCount) {
      toCheck.delete('E')
      toCheck.delete('SE')
      toCheck.delete('NE')
    }
    Array.from(toCheck).map(value => {
      switch (value) {
        case 'N':
          map[row - dist][column] == '#' && count++
          map[row - dist][column] != '.' && toCheck.delete('N')
          break
        case 'S':
          map[row + dist][column] == '#' && count++
          map[row + dist][column] != '.' && toCheck.delete('S')
          break
        case 'E':
          map[row][column + dist] == '#' && count++
          map[row][column + dist] != '.' && toCheck.delete('E')
          break
        case 'W':
          map[row][column - dist] == '#' && count++
          map[row][column - dist] != '.' && toCheck.delete('W')
          break
        case 'NE':
          map[row - dist][column + dist] == '#' && count++
          map[row - dist][column + dist] != '.' && toCheck.delete('NE')
          break
        case 'SE':
          map[row + dist][column + dist] == '#' && count++
          map[row + dist][column + dist] != '.' && toCheck.delete('SE')
          break
        case 'SW':
          map[row + dist][column - dist] == '#' && count++
          map[row + dist][column - dist] != '.' && toCheck.delete('SW')
          break
        case 'NW':
          map[row - dist][column - dist] == '#' && count++
          map[row - dist][column - dist] != '.' && toCheck.delete('NW')
          break
      }
    })
    dist++
  }
  return count
}

const simulate = () => {
  let changed = false
  let newMap = []
  const columnCount = map[0].length
  for (let i = 0; i < map.length; i++) {
    newMap.push([])
    for (let j = 0; j < columnCount; j++) {
      newMap[i][j] = map[i][j]
      const neigborsCount = getNeigborsCount(i, j)
      if (map[i][j] == 'L' && neigborsCount == 0) {
        changed = true
        newMap[i][j] = '#'
        continue
      }
      if (map[i][j] == '#' && neigborsCount > 4) {
        changed = true
        newMap[i][j] = 'L'
        continue
      }
    }
  }
  map = newMap
  return changed
}

const countOccupied = () => {
  return map.reduce((acc, value) => {
    acc += value.reduce((acc, value) => {
      acc += value == '#' ? 1 : 0
      return acc
    }, 0)
    return acc
  }, 0)
}

lineReader.on('line', function (line) {
  map.push(line.split(''))
})

lineReader.on('close', function () {
  while (simulate()) {}
  console.log(countOccupied())
})
