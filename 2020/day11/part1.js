var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let map = []

const getNeigborsCount = (row, column) => {
  const columnCount = map[0].length
  let count = 0
  for (let i = Math.max(0, row - 1); i <= Math.min(map.length - 1, row + 1); i++) {
    for (let j = Math.max(0, column - 1); j <= Math.min(columnCount - 1, column + 1); j++) {
      if (i != row || j != column) {
        count += map[i][j] == '#' ? 1 : 0
      }
    }
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
      if (map[i][j] == '#' && neigborsCount > 3) {
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
