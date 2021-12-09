const toDecimal = require('../../utils/toDecimal')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = []

lineReader.on('line', function (line) {
  map.push(line.split('').map(toDecimal))
})

function isLowest(x, y, depth, ignored = new Map()) {
  return (
    depth < 9 &&
    [-1, 0, 1].every(row =>
      [-1, 0, 1].every(column => {
        if (Math.abs(row) == Math.abs(column)) {
          return true
        }
        if (ignored.has(`${x + column}|${y + row}`)) {
          return true
        }
        return (
          map[y + row] == undefined ||
          map[y + row][x + column] == undefined ||
          map[y + row][x + column] >= depth
        )
      })
    )
  )
}

function getNeigbours(x, y) {
  return [-1, 0, 1].reduce(
    (acc, row) =>
      acc.concat(
        [-1, 0, 1].reduce((acc, column) => {
          if (Math.abs(row) == Math.abs(column)) {
            return acc
          }
          if (map[y + row] != undefined && map[y + row][x + column] != undefined) {
            acc.push({ x: x + column, y: y + row, depth: map[y + row][x + column] })
          }
          return acc
        }, [])
      ),
    []
  )
}

lineReader.on('close', function () {
  const lowPoints = map.reduce((acc, row, rowIndex) => {
    return acc.concat(
      row.reduce((acc, column, columnIndex) => {
        if (isLowest(columnIndex, rowIndex, column)) {
          acc.push({
            x: columnIndex,
            y: rowIndex,
            value: column
          })
        }
        return acc
      }, [])
    )
  }, [])

  const inBasins = new Set()

  const basins = lowPoints
    .map(point => {
      const basin = new Set()
      const visited = new Set()
      let currentPoint = point
      basin.add(`${currentPoint.x}|${currentPoint.y}`)
      visited.add(`${currentPoint.x}|${currentPoint.y}`)
      inBasins.add(`${currentPoint.x}|${currentPoint.y}`)
      let pointsToCheck = getNeigbours(currentPoint.x, currentPoint.y)
        .filter(
          point => !basin.has(`${point.x}|${point.y}`) && !visited.has(`${point.x}|${point.y}`)
        )
        .sort((a, b) => a.depth - b.depth)

      while (pointsToCheck.length) {
        currentPoint = pointsToCheck.shift()
        if (
          basin.has(`${currentPoint.x}|${currentPoint.y}`) ||
          visited.has(`${currentPoint.x}|${currentPoint.y}`)
        ) {
          continue
        }
        visited.add(`${currentPoint.x}|${currentPoint.y}`)
        if (isLowest(currentPoint.x, currentPoint.y, map[currentPoint.y][currentPoint.x], basin)) {
          basin.add(`${currentPoint.x}|${currentPoint.y}`)
          inBasins.add(`${currentPoint.x}|${currentPoint.y}`)
          pointsToCheck = pointsToCheck
            .concat(
              getNeigbours(currentPoint.x, currentPoint.y).filter(
                point =>
                  !basin.has(`${point.x}|${point.y}`) && !visited.has(`${point.x}|${point.y}`)
              )
            )
            .sort((a, b) => a.depth - b.depth)
        }
      }
      return basin
    })
    .sort((a, b) => b.size - a.size)

  console.log(basins[0].size * basins[1].size * basins[2].size)
})
