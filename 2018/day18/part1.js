var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = []

function render(map) {
  console.log(map.map(row => row.join('')).join('\n'))
}

function adjacentCount(map, row, cell, cellType) {
  return [-1, 0, 1].reduce((acc, y) => {
    return (
      acc +
      [-1, 0, 1].reduce((acc2, x) => {
        return (
          acc2 +
          (!map[row + y] ? 0 : y === 0 && x === 0 ? 0 : map[row + y][cell + x] === cellType ? 1 : 0)
        )
      }, 0)
    )
  }, 0)
}

lineReader.on('line', function (line) {
  map.push(line.split(''))
})

lineReader.on('close', function () {
  // render(map)
  let currentMap = map
  let minutes = 0

  // console.log(currentMap[3][4], adjacentCount(currentMap, 3, 4, '|'))
  // process.exit(1)

  while (minutes++ < 10) {
    const nextMap = []
    for (let row = 0; row < currentMap.length; row++) {
      let nextRow = []
      nextMap.push(nextRow)
      for (let cell = 0; cell < currentMap[0].length; cell++) {
        const currentCell = currentMap[row][cell]
        switch (currentCell) {
          case '.':
            if (adjacentCount(currentMap, row, cell, '|') >= 3) {
              nextRow.push('|')
            } else {
              nextRow.push('.')
            }
            break
          case '|':
            if (adjacentCount(currentMap, row, cell, '#') >= 3) {
              nextRow.push('#')
            } else {
              nextRow.push('|')
            }
            break
          case '#':
            if (
              adjacentCount(currentMap, row, cell, '#') &&
              adjacentCount(currentMap, row, cell, '|')
            ) {
              nextRow.push('#')
            } else {
              nextRow.push('.')
            }
            break
        }
      }
    }
    currentMap = nextMap.slice(0).map(row => row.slice(0))
    // console.log(`After ${minutes}`)
    // render(currentMap)
  }
  const resources = currentMap.reduce(
    (acc, row) => {
      const rowData = row.reduce(
        (acc2, cell) => {
          return {
            wood: acc2.wood + (cell === '|' ? 1 : 0),
            ly: acc2.ly + +(cell === '#' ? 1 : 0)
          }
        },
        { wood: 0, ly: 0 }
      )
      return {
        wood: acc.wood + rowData.wood,
        ly: acc.ly + rowData.ly
      }
    },
    { wood: 0, ly: 0 }
  )

  console.log(resources.wood * resources.ly)
})
