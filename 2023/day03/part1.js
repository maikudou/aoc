const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let sum = 0
let currentNumber = null
let currentNumberStart = null
let lineNum = 0
let symbols = new Map()
let numbers = new Map()

lineReader.on('line', function (line) {
  line.split('').forEach((cell, index) => {
    if (cell !== '.') {
      if (isNaN(cell)) {
        symbols.set(`${index}|${lineNum}`, cell)
        currentNumber = null
      } else {
        if (currentNumber === null) {
          currentNumber = toDecimal(cell)
          currentNumberStart = `${index}|${lineNum}`
          numbers.set(currentNumberStart, currentNumber)
        } else {
          currentNumber = currentNumber * 10 + toDecimal(cell)
          numbers.set(currentNumberStart, currentNumber)
        }
      }
    } else {
      currentNumber = null
    }
  })
  lineNum++
})

lineReader.on('close', function () {
  Array.from(numbers.entries()).forEach(([position, value]) => {
    const [x, y] = position.split('|').map(toDecimal)
    const numLength = value <= 1 ? 1 : Math.ceil(Math.log10(parseInt(value, 10)))
    let good = false
    for (let j = -1; j < 2; j++) {
      for (let i = x - 1; i <= x + numLength; i++) {
        if (j == 0 && i !== x - 1 && i !== x + numLength) {
          continue
        }
        if (symbols.has(`${i}|${y + j}`)) {
          good = true
          sum += value
          break
        }
      }
    }
  })
  console.log(sum)
})
