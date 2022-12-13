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
          ? { height: 0, distance: Infinity, letter: 'a', x, y }
          : l === 'E'
          ? { height: 'z'.charCodeAt(0) - 97, distance: Infinity, letter: l, x, y }
          : { height: l.charCodeAt(0) - 97, distance: Infinity, letter: l, x, y }
      )
  )
  y++
})

lineReader.on('close', function () {
  const starts = map.reduce((acc, row) => acc.concat(row.filter(({ height }) => height === 0)), [])
  const [endX, endY] = map.reduce(
    (acc, row, index) =>
      acc[0] === null
        ? row.findIndex(({ letter }) => letter === 'E') === -1
          ? [null, null]
          : [row.findIndex(({ letter }) => letter === 'E'), index]
        : acc,
    [null, null]
  )

  const minSteps = starts.reduce((acc, start) => {
    const localMap = map.slice().map(row => row.slice().map(cell => ({ ...cell })))
    localMap[start.y][start.x].distance = 0
    const nodesToConsider = [localMap[start.y][start.x]]

    while (nodesToConsider.length) {
      let currentNode = nodesToConsider.shift()
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (
            Math.abs(i) !== Math.abs(j) &&
            localMap[currentNode.y + i] &&
            localMap[currentNode.y + i][currentNode.x + j] &&
            localMap[currentNode.y + i][currentNode.x + j].height - currentNode.height <= 1 &&
            localMap[currentNode.y + i][currentNode.x + j].distance > currentNode.distance + 1
          ) {
            localMap[currentNode.y + i][currentNode.x + j].distance = Math.min(
              localMap[currentNode.y + i][currentNode.x + j].distance,
              currentNode.distance + 1
            )
            nodesToConsider.push(localMap[currentNode.y + i][currentNode.x + j])
          }
        }
      }
    }
    return Math.min(localMap[endY][endX].distance, acc)
  }, Infinity)

  console.log(minSteps)
})
