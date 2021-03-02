var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let input

lineReader.on('line', function (line) {
  input = line
    .split('')
    .map(function (string) {
      return string.codePointAt()
    })
    .concat([17, 31, 73, 47, 23])
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

  for (var round = 0; round < 64; round++) {
    for (var i = 0; i < input.length; i++) {
      length = input[i]
      if (length > nodes.length) {
        continue
      }
      change = pos + length - nodes.length
      selected = nodes.slice(pos, pos + length)

      if (change > 0) {
        selected = selected.concat(nodes.slice(0, change))
      }
      selected.reverse()

      if (pos >= nodes.length) {
        console.log(pos)
      }

      replacePos = pos
      for (var j = 0; j < selected.length; j++) {
        if (replacePos == nodes.length) {
          replacePos = 0
        }

        if (replacePos >= nodes.length) {
          // console.log(replacePos);
        }

        nodes[replacePos] = selected[j]

        replacePos++
      }

      pos += length + skip

      while (pos >= nodes.length) {
        pos = pos - nodes.length
      }

      skip++
    }
  }

  var sparse = []
  var xored
  for (i = 0; i < 16; i++) {
    xored = 0
    for (k = 0; k < 16; k++) {
      xored = xored ^ nodes[16 * i + k]
    }
    if (xored > 15) {
      sparse.push(xored.toString(16))
    } else {
      sparse.push('0' + xored.toString(16))
    }
  }
  console.log(sparse.join(''))
})
