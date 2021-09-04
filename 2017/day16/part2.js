const dance = require('./dance')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let input

lineReader.on('line', function (line) {
  input = line
})

lineReader.on('close', function () {
  // const itemsMap = new Map()
  let starter = {
    letter: 'a',
    next: null,
    prev: null
  }

  let current = starter

  for (let i = 1; i < 16; i++) {
    const letter = String.fromCharCode(97 + i)
    const next = {
      letter,
      next: null,
      prev: current
    }
    current.next = next
    current = next
  }
  current.next = starter
  starter.prev = current

  const moves = input.split(',')
  const log = new Set()
  const positions = new Map()
  let repeatIteration

  for (let i = 0; i < 1000000000; i++) {
    result = dance(moves, starter)
    position = result.position
    starter = result.starter
    if (log.has(position)) {
      repeatIteration = i
      break
    }
    log.add(position)
    positions.set(i, position)
  }
  console.log(positions.get((1000000000 % repeatIteration) - 1))
})
