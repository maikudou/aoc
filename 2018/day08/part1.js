var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var input

function parseNode(start) {
  var sum = 0
  var childCount = input[start]
  var metaCount = input[start + 1]
  var nextIndex = start + 2

  if (childCount === 0) {
    for (var i = 0; i < metaCount; i++) {
      sum += input[start + 2 + i]
    }
    return [sum, start + 2 + metaCount]
  } else {
    while (childCount) {
      var [nextSum, nextEnd] = parseNode(nextIndex)
      sum += nextSum
      nextIndex = nextEnd
      childCount--
    }
    for (var i = 0; i < metaCount; i++) {
      sum += input[nextIndex + i]
    }
    return [sum, nextIndex + metaCount]
  }
}

lineReader.on('line', function (line) {
  input = line.split(' ').map(Number)
  var [sum] = parseNode(0)
  console.log(sum)
})

lineReader.on('close', function () {})
