var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const patterns = new Set()
let count = 0

function isPossible(design) {
  let paths = [0]
  let possible = false
  while (paths.length) {
    path = paths.shift()
    if (path === design.length - 1) {
      possible = true
      break
    }
    let i = 1
    while (path + i <= design.length) {
      const variant = design.substring(path, path + i)
      if (patterns.has(variant) && !paths.includes(path + i)) {
        paths.push(path + i)
      }
      i++
    }
  }
  return possible
}

lineReader.on('line', function (line) {
  if (line) {
    if (patterns.size) {
      if (isPossible(line)) {
        count++
      }
    } else {
      line.split(', ').forEach(pattern => patterns.add(pattern))
    }
  }
})

lineReader.on('close', function () {
  console.log(count)
})
