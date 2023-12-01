var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/test')
})
let wind
lineReader.on('line', function (line) {
  wind = line
})

const shapes = [
  [[true, true, true, true]],
  [
    [false, true],
    [true, true, true],
    [false, true]
  ],
  [
    [true, true, true],
    [false, false, true],
    [false, false, true]
  ],
  [[true], [true], [true], [true]],
  [
    [true, true],
    [true, true]
  ]
]

function shapeWidth(shape) {
  return shape.reduce((acc, row) => Math.max(acc, row.length), 0)
}

function isIntersecting(figureState, fillState) {
  return fillState
    .slice(figureState.y)
    .some((row, rowIndex) =>
      row
        .slice(figureState.x)
        .some((cell, cellIndex) => cell !== null && figureState.shape[rowIndex]?.[cellIndex])
    )
}

const playfield = {
  width: 7
}

function validate(figureState, fillState) {
  return figureState
    ? figureState.x > -1
      ? figureState.x + shapeWidth(figureState.shape) <= playfield.width
        ? figureState.y > -1
          ? !isIntersecting(figureState, fillState)
          : false
        : false
      : false
    : false
}

function fillFigure(figureState, fillState) {
  return figureState.shape.reduce((acc, val, index) => {
    for (let i = 0; i < figureState.y + figureState.shape.length; i++) {
      acc[i] = acc[i] || []
    }
    for (let i = 0; i < figureState.x; i++) {
      acc[figureState.y + index][i] =
        acc[figureState.y + index][i] !== null && acc[figureState.y + index][i] !== undefined
          ? acc[figureState.y + index][i]
          : null
    }
    for (let i = 0; i < val.length; i++) {
      acc[figureState.y + index][figureState.x + i] = val[i]
        ? '#'
        : acc[figureState.y + index][figureState.x + i] !== null &&
          acc[figureState.y + index][figureState.x + i] !== undefined
        ? acc[figureState.y + index][figureState.x + i]
        : null
    }
    return acc
  }, fillState)
}

let fillState = []

function createFigureState() {
  let shape = shapes.shift()
  shapes.push(shape)
  return { x: 2, y: fillState.length + 3, shape }
}

function render(fillState) {
  fillState
    .slice(0)
    .reverse()
    .forEach(row => {
      console.log(
        `|${row
          .map(cell => (cell ? cell : '.'))
          .join('')
          .padEnd(7, '.')}|`
      )
    })
  console.log('+-------+\n')
}

function renderRow(row) {
  return row
    .map(cell => (cell ? cell : '.'))
    .join('')
    .padEnd(7, '.')
}

lineReader.on('close', function () {
  let dropppedCount = 0
  let figureState = createFigureState()
  let windPos = 0

  while (dropppedCount < 2022) {
    windPos = windPos === wind.length ? 0 : windPos
    let possibleState = { ...figureState, x: figureState.x + (wind[windPos++] === '>' ? 1 : -1) }
    if (validate(possibleState, fillState)) {
      figureState = possibleState
    }
    possibleState = { ...figureState, y: figureState.y - 1 }
    if (validate(possibleState, fillState)) {
      figureState = possibleState
    } else {
      fillState = fillFigure(figureState, fillState)
      figureState = createFigureState()
      // console.log(figureState)
      // render(fillState)
      dropppedCount++
    }
  }
  console.log(fillState.length)
  let start = 0
  let start2 = fillState.findIndex(
    (row, index) => index > start + 10 && renderRow(row) === renderRow(fillState[start])
  )
  let good = false
  while (!good) {
    for (let i = 0; i < start2 - start; i++) {
      good = renderRow(fillState[start + i]) === renderRow(fillState[start2 + i])
      if (!good) {
        break
      }
    }
    if (!good) {
      start++
      start2 = fillState.findIndex(
        (row, index) => index > start + 10 && row.join('') === fillState[start].join('')
      )
    }
  }
  console.log(fillState.length)

  fillState = []

  const cycleStart = start
  const cycleLength = start2 - start
  console.log(cycleStart, cycleLength)
  let counts = []
  dropppedCount = 0
  let startDropppedCount

  while (fillState.length < cycleStart + cycleLength) {
    windPos = windPos === wind.length ? 0 : windPos
    let possibleState = { ...figureState, x: figureState.x + (wind[windPos++] === '>' ? 1 : -1) }
    if (validate(possibleState, fillState)) {
      figureState = possibleState
    }
    possibleState = { ...figureState, y: figureState.y - 1 }
    if (validate(possibleState, fillState)) {
      figureState = possibleState
    } else {
      const prevLength = fillState.length
      fillState = fillFigure(figureState, fillState)
      figureState = createFigureState()
      // console.log(figureState)
      // render(fillState)
      dropppedCount++
      if (prevLength < cycleStart && fillState.length >= cycleStart) {
        startDropppedCount = dropppedCount
      }
      if (fillState.length >= cycleStart) {
        counts.push(fillState.length - prevLength)
      }
    }
  }
  counts.pop()
  first = counts.pop()
  counts.unshift(first)
  first = counts.pop()
  counts.unshift(first)
  console.log(
    startDropppedCount,
    counts,
    counts.length,
    counts.reduce((acc, v) => acc + v, 0)
  )
  console.log(
    Math.floor((1000000000000 - startDropppedCount) / counts.length),
    (1000000000000 - startDropppedCount) % counts.length
  )
  console.log(
    counts.reduce((acc, v) => acc + v, 0) *
      Math.floor((1000000000000 - startDropppedCount) / counts.length) +
      counts
        .slice(0, (1000000000000 - startDropppedCount) % counts.length)
        .reduce((acc, v) => acc + v, 0) +
      61
  )
  // render(fillState)
})
