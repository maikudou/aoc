const { Heap } = require('../../utils/Heap')
const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/test')
})

class MaxHeap extends Heap {
  _compare(a, b) {
    return a > b
  }
}

const patterns = new Set()
let count = 0

function isPossible(design) {
  const paths = new MaxHeap()
  paths.insert(0)
  let possible = false
  while (paths.length) {
    path = paths.pop()
    if (path === design.length - 1) {
      possible = true
      break
    }
    let i = 1
    while (path + i <= design.length) {
      const variant = design.substring(path, path + i)
      if (patterns.has(variant)) {
        paths.insert(path + i)
      }
      i++
    }
  }
  return possible
}

lineReader.on('line', function (line) {
  if (line) {
    if (patterns.size) {
      console.log('Line:', line)
      let currentStart = 0
      let currentLength = 1
      if (isPossible(line)) {
        while (currentStart + currentLength <= line.length) {
          const design = line.substring(currentStart, currentStart + currentLength)
          if (isPossible(design)) {
            console.log(design)
            currentLength++
          } else {
            currentStart += currentLength
          }
          currentLength++
        }
        console.log('+\n')
      } else {
        console.log('-\n')
      }
      process.exit()
    } else {
      line.split(', ').forEach(pattern => patterns.add(pattern))
    }
  }
})

lineReader.on('close', function () {
  console.log(count)
})
