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
      const possible = new Set()
      for (let i = 0; i < line.length; i++) {
        if (isPossible(line.substring(i))) {
          possible.add(i)
        }
      }
      const tried = new Set()
      if (!possible.has(0)) {
        return
      }
      let paths = [{ index: 0, hash: '' }]
      let localCount = 0
      while (paths.length) {
        path = paths.shift()
        tried.add(path.hash)

        let i = 0
        while (path.index + i <= line.length) {
          i++
          const variant = line.substring(path.index, path.index + i)
          if (patterns.has(variant)) {
            if (path.index + i === line.length) {
              localCount++
            } else if (!tried.has(`${path.hash},${variant}`) && possible.has(path.index + i)) {
              paths.push({ index: path.index + i, hash: `${path.hash},${variant}` })
            }
          }
        }
        paths.sort((a, b) => b.index - a.index)
      }
      count += localCount
    } else {
      line.split(', ').forEach(pattern => patterns.add(pattern))
    }
  }
})

lineReader.on('close', function () {
  console.log(count)
})
