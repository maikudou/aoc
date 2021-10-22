var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})
let currentState
let checksumIterations
let parsingState
let parsingStateCurrentValue
let cursor = 0
let cells = new Map()

const stateRegExp = /^In state (\w+):$/
const stateWriteRegExp = /    - Write the value (\d+)\./
const stateMoveRegExp = /    - Move one slot to the (\w+)\./
const stateContinueRegExp = /    - Continue with state (\w+)\./

const states = new Map()
let lineCounter = 0

lineReader.on('line', function (line) {
  if (!currentState) {
    currentState = /Begin in state (\w+)\./.exec(line)[1]
  } else if (!checksumIterations) {
    checksumIterations = /Perform a diagnostic checksum after (\d+) steps./.exec(line)[1]
  } else if (line) {
    if (stateRegExp.test(line)) {
      parsingState = stateRegExp.exec(line)[1]
      parsingStateCurrentValue = 0
      states.set(parsingState, { 0: {}, 1: {} })
      lineCounter = 0
    } else if (lineCounter == 2 || lineCounter == 6) {
      states.get(parsingState)[parsingStateCurrentValue].write = parseInt(
        stateWriteRegExp.exec(line)[1],
        10
      )
    } else if (lineCounter == 3 || lineCounter == 7) {
      states.get(parsingState)[parsingStateCurrentValue].move = stateMoveRegExp.exec(line)[1]
    } else if (lineCounter == 4 || lineCounter == 8) {
      states.get(parsingState)[parsingStateCurrentValue].continue = stateContinueRegExp.exec(
        line
      )[1]
    } else if (lineCounter == 5) {
      parsingStateCurrentValue = 1
    }
    lineCounter++
  }
})

lineReader.on('close', function () {
  for (let i = 0; i < checksumIterations; i++) {
    const state = states.get(currentState)
    const cursorValue = cells.get(cursor) || 0
    cells.set(cursor, state[cursorValue].write)
    cursor += state[cursorValue].move == 'right' ? 1 : -1
    currentState = state[cursorValue].continue
  }
  console.log(Array.from(cells.values()).reduce((acc, value) => (acc += value), 0))
})
