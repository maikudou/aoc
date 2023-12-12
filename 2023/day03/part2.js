const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let sum = 0
let currentNumber = null
let currentNumberStart = null
let lineNum = 0
let symbols = new Set()
let numberIds = new Map()
let numbersById = new Map()
let id = 0

lineReader.on('line', function (line) {
  line.split('').forEach((cell, index) => {
    if (cell !== '.') {
      if (isNaN(cell)) {
        if (cell === '*') {
          symbols.add(`${index}|${lineNum}`)
        }
        currentNumber = null
      } else {
        if (currentNumber === null) {
          currentNumberStart = `${index}|${lineNum}`
          currentNumber = { value: toDecimal(cell), id: id++ }
          numberIds.set(currentNumberStart, currentNumber.id)
          numbersById.set(currentNumber.id, currentNumber)
        } else {
          currentNumber = { ...currentNumber, value: currentNumber.value * 10 + toDecimal(cell) }
          numberIds.set(`${index}|${lineNum}`, currentNumber.id)
          numbersById.set(currentNumber.id, currentNumber)
        }
      }
    } else {
      currentNumber = null
    }
  })
  lineNum++
})

lineReader.on('close', function () {
  Array.from(symbols.values()).forEach(position => {
    const [x, y] = position.split('|').map(toDecimal)
    const neigboursNumberIds = new Set()
    for (let j = -1; j <= 1; j++) {
      for (let i = x - 1; i <= x + 1; i++) {
        if (numberIds.has(`${i}|${y + j}`)) {
          neigboursNumberIds.add(numberIds.get(`${i}|${y + j}`))
        }
      }
    }
    if (neigboursNumberIds.size === 2) {
      const ids = Array.from(neigboursNumberIds.values())
      sum += numbersById.get(ids[0]).value * numbersById.get(ids[1]).value
    }
  })
  console.log(sum)
})
