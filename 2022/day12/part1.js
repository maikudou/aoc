var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = []
let y = 0

lineReader.on('line', function (line) {
  map.push(
    line
      .split('')
      .map((l, x) =>
        l === 'S'
          ? { height: 0, distance: 0, letter: l, x, y }
          : l === 'E'
          ? { height: 'z'.charCodeAt(0) - 97, distance: Infinity, letter: l, x, y }
          : { height: l.charCodeAt(0) - 97, distance: Infinity, letter: l, x, y }
      )
  )
  y++
})

lineReader.on('close', function () {
  const [startX, startY] = map.reduce(
    (acc, row, index) =>
      acc[0] === null
        ? row.findIndex(({ letter }) => letter === 'S') === -1
          ? [null, null]
          : [row.findIndex(({ letter }) => letter === 'S'), index]
        : acc,
    [null, null]
  )
  const [endX, endY] = map.reduce(
    (acc, row, index) =>
      acc[0] === null
        ? row.findIndex(({ letter }) => letter === 'E') === -1
          ? [null, null]
          : [row.findIndex(({ letter }) => letter === 'E'), index]
        : acc,
    [null, null]
  )
  const nodesToConsider = [map[startY][startX]]

  while (nodesToConsider.length) {
    let currentNode = nodesToConsider.shift()

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (
          Math.abs(i) !== Math.abs(j) &&
          map[currentNode.y + i] &&
          map[currentNode.y + i][currentNode.x + j] &&
          map[currentNode.y + i][currentNode.x + j].height - currentNode.height <= 1 &&
          map[currentNode.y + i][currentNode.x + j].distance > currentNode.distance + 1
        ) {
          map[currentNode.y + i][currentNode.x + j].distance = Math.min(
            map[currentNode.y + i][currentNode.x + j].distance,
            currentNode.distance + 1
          )
          nodesToConsider.push(map[currentNode.y + i][currentNode.x + j])
        }
      }
    }
  }

  console.log(map[endY][endX].distance)
})
