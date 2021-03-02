var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let sum = 0

function findClosing(str, index) {
  let stack = 1
  while (stack > 0) {
    index++
    if (str[index] == '(') {
      stack++
    } else if (str[index] == ')') {
      stack--
    }
  }
  return index
}

function parse(str) {
  let index = 0
  let currentString = ''
  let operands = []
  let operators = []
  while (index < str.length) {
    switch (str[index]) {
      case ' ':
        operands.push(parseInt(currentString, 10))
        currentString = ''
        break
      case '+':
      case '*':
        operators.push(str[index])
        index++
        break
      case '(':
        const closing = findClosing(str, index)
        operands.push(parse(str.substring(index + 1, closing)))
        index = closing + 1
        break
      default:
        currentString += str[index]
    }
    index++
  }
  if (currentString) {
    operands.push(parseInt(currentString, 10))
  }
  let i = 1
  let j = 0
  let result = operands[0]
  while (j < operators.length) {
    if (operators[j] == '+') {
      result += operands[i++]
    } else {
      result *= operands[i++]
    }
    j++
  }
  return result
}

lineReader.on('line', function (line) {
  sum += parse(line)
})

lineReader.on('close', function () {
  console.log(sum)
})
