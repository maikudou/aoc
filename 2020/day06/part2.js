var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let sum = 0
let currentMap = new Map()
let currentGroupSize = 0

function calculateSum(map, count) {
  let sum = 0
  const iterator = map.values()
  let next = iterator.next()
  while (!next.done) {
    if (count === next.value) {
      sum++
    }
    next = iterator.next()
  }
  return sum
}

lineReader.on('line', function (line) {
  if (!line) {
    sum += calculateSum(currentMap, currentGroupSize)
    currentMap = new Map()
    currentGroupSize = 0
  } else {
    for (var i = 0; i < line.length; i++) {
      currentMap.set(line[i], (currentMap.get(line[i]) || 0) + 1)
    }
    currentGroupSize++
  }
})

lineReader.on('close', function () {
  sum += calculateSum(currentMap, currentGroupSize)
  console.log(sum)
})
