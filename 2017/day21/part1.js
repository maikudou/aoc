var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

function flipX(pattern) {
  return pattern.slice().reverse()
}
function flipY(pattern) {
  return pattern.map(row => row.slice().reverse())
}
function rotateCW(pattern) {
  return pattern
    .slice()
    .reverse()
    .reduce((acc, row, rowIndex, reversedPattern) => {
      acc[rowIndex] = acc[rowIndex] || []
      row.forEach((cell, cellIndex) => {
        acc[rowIndex][cellIndex] = reversedPattern[cellIndex][rowIndex]
      })
      return acc
    }, [])
}
function isMatch(rule, pattern) {
  if (pattern.length !== rule.length) {
    return false
  }
  if (pattern.length === 3 && pattern[1][1] !== rule[1][1]) {
    return false
  }
  // All patterns: original, flipX, rotateCW, flipY, rotateCW, flipX, rotateCW. flipY
  pattern = pattern.slice()
  if (isEqual(rule, pattern)) {
    return true
  }
  pattern = flipX(pattern)
  if (isEqual(rule, pattern)) {
    return true
  }
  pattern = rotateCW(pattern)
  if (isEqual(rule, pattern)) {
    return true
  }
  pattern = flipY(pattern)
  if (isEqual(rule, pattern)) {
    return true
  }
  pattern = rotateCW(pattern)
  if (isEqual(rule, pattern)) {
    return true
  }
  pattern = flipX(pattern)
  if (isEqual(rule, pattern)) {
    return true
  }
  pattern = rotateCW(pattern)
  if (isEqual(rule, pattern)) {
    return true
  }
  pattern = flipY(pattern)
  if (isEqual(rule, pattern)) {
    return true
  }
}

function isEqual(rule, pattern) {
  return rule.every((row, rowIndex) =>
    row.every((cell, cellIndex) => cell === pattern[rowIndex][cellIndex])
  )
}

function processStep(grid) {
  let newGrid = []
  let devisor = grid.length % 2 ? 3 : 2
  let size = grid.length / devisor

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      let gridElement = []
      for (var k = 0; k < devisor; k++) {
        gridElement.push(grid[devisor * i + k].slice(devisor * j, devisor * (j + 1)))
      }
      // console.log(rules.find(rule => isMatch(rule.from, gridElement)))
      newGrid.push(rules.find(rule => isMatch(rule.from, gridElement)).to)
    }
  }

  return compose(newGrid)
}

function compose(patterns) {
  const length = Math.sqrt(patterns.length)
  const composedGrid = []
  const patternSize = patterns[0].length

  patterns.forEach((pattern, index) => {
    const patternsRow = Math.floor(index / length)
    const patternsColumn = index % length
    pattern.forEach((row, rowIndex) => {
      const resultingRow = patternsRow * patternSize + rowIndex
      composedGrid[resultingRow] = composedGrid[resultingRow] || []
      row.forEach((cell, cellIndex) => {
        composedGrid[resultingRow][patternsColumn * patternSize + cellIndex] = cell
      })
    })
  })

  // console.log(composedGrid)

  return composedGrid
}

let grid = [
  ['.', '#', '.'],
  ['.', '.', '#'],
  ['#', '#', '#']
]

const rules = []

lineReader.on('line', function (line) {
  const rule = line.split(' => ')
  rules.push({
    from: rule[0].split('/').map(row => row.split('')),
    to: rule[1].split('/').map(row => row.split(''))
  })
})

lineReader.on('close', function () {
  // console.log(rules.find(rule => isMatch(rule.from, grid)))

  for (let i = 0; i < 5; i++) {
    grid = processStep(grid)
  }
  console.log(
    'Part1:',
    grid.reduce((acc, row) => acc + row.reduce((acc, cell) => (acc += cell === '#' ? 1 : 0), 0), 0)
  )
  for (let i = 5; i < 18; i++) {
    grid = processStep(grid)
  }
  console.log(
    'Part2:',
    grid.reduce((acc, row) => acc + row.reduce((acc, cell) => (acc += cell === '#' ? 1 : 0), 0), 0)
  )
})
