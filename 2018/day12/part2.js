var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var initialState
const rules = new Map()

var pots
var centerIndex = 0
var rule
var test
var value

lineReader.on('line', function (line) {
  if (!initialState) {
    initialState = line.substr(15)
  } else if (line != '') {
    rules.set(line.slice(0, 5), line[9])
  }
})

var patterns = new Set()
const generations = 50000000000
let correction = 0

lineReader.on('close', function () {
  let pots = initialState
  for (let i = 0; i < generations; i++) {
    if (pots[0] == '#' || pots[1] == '#') {
      pots = `..${pots}`
      correction -= 2
    }
    if (pots[pots.length - 1] == '#' || pots[pots.length - 2] == '#') {
      pots = `${pots}..`
    }
    newPots = pots
    // console.log(newPots)
    for (let j = 0; j < pots.length; j++) {
      const pattern = `${pots[j - 2] || '.'}${pots[j - 1] || '.'}${pots[j]}${pots[j + 1] || '.'}${
        pots[j + 2] || '.'
      }`
      const current = newPots[j]
      const newOne = rules.get(pattern) || '.'
      if (current !== newOne) {
        newPots = `${newPots.substring(0, j)}${newOne}${newPots.substring(j + 1)}`
      }
    }
    // It starts to just drift right eventually
    if (newPots.substring(1) == pots.substring(0, pots.length - 1)) {
      correction += generations - i - 1
      break
    }
    pots = newPots
  }
  console.log(
    newPots.split('').reduce((acc, value, index) => {
      return acc + (value == '#' ? correction + index : 0)
    }, 0)
  )
})
