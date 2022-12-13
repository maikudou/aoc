const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let index = 1
let sum = 0
let lineA = null
let lineB = null

function parseLine(line) {
  const stack = [[]]
  let str = ''
  let parsed
  line.split('').forEach(char => {
    switch (char) {
      case '[':
        const arr = []
        stack[stack.length - 1].push(arr)
        stack.push(arr)
        break
      case ']':
        if (str) {
          stack[stack.length - 1].push(toDecimal(str))
          str = ''
        }
        parsed = stack.pop()
        break
      case ',':
        if (str) {
          stack[stack.length - 1].push(toDecimal(str))
          str = ''
        }
        break
      default:
        str = `${str}${char}`
        break
    }
  })
  return parsed
}

function compare(left, right) {
  // console.log(left, '|', right)
  if (!Array.isArray(left) && !Array.isArray(right)) {
    return left - right
  }
  if (!Array.isArray(left) && Array.isArray(right)) {
    return compare([left], right)
  }
  if (Array.isArray(left) && !Array.isArray(right)) {
    return compare(left, [right])
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    let comparison = 0
    for (let i = 0; i < left.length; i++) {
      if (typeof right[i] !== 'undefined') {
        comparison = compare(left[i], right[i]) || comparison
      }
      if (comparison != 0) {
        break
      }
    }
    if (!comparison) {
      comparison = left.length - right.length
    }
    return comparison
  }
}

lineReader.on('line', function (line) {
  if (!line) {
    index++
    lineA = null
    lineB = null
  }
  if (line) {
    lineB = lineA ? parseLine(line) : null
    lineA = lineA ? lineA : parseLine(line)

    if (lineA && lineB) {
      if (compare(lineA, lineB) < 0) {
        // console.log(index, lineA, lineB)
        sum += index
      }
    }
  }
})

lineReader.on('close', function () {
  console.log(sum)
})
