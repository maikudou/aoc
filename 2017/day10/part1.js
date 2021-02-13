var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let input

lineReader.on('line', function (line) {
  input = line.split(',')
})

lineReader.on('close', function () {
  var nodes = []
  for (var i = 0; i < 256; i++) {
    nodes.push(i)
  }

  var pos = 0
  var replacePos
  var skip = 0
  var length
  var selected
  var change

  for (var i = 0; i < input.length; i++) {
    length = parseInt(input[i])
    if (length > nodes.length) {
      continue
    }
    change = pos + length - nodes.length
    selected = nodes.slice(pos, pos + length)

    if (change > 0) {
      selected = selected.concat(nodes.slice(0, change))
    }
    selected.reverse()

    replacePos = pos
    for (var j = 0; j < selected.length; j++) {
      if (replacePos == nodes.length) {
        replacePos = 0
      }

      nodes[replacePos] = selected[j]

      replacePos++
    }

    pos += length + skip

    if (pos >= nodes.length) {
      pos = pos - nodes.length
    }

    skip++
  }
  console.log(nodes[0] * nodes[1])
})
