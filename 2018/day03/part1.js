var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const fabric = []

for (var i = 0; i < 1000; i++) {
  fabric[i] = []
  for (var j = 0; j < 1000; j++) {
    fabric[i].push(0)
  }
}

var overlaps = 0

lineReader.on('line', function (line) {
  line = /#\d+ @ (\d+),(\d+): (\d+)x(\d+)/.exec(line)

  line[1] = parseInt(line[1])
  line[2] = parseInt(line[2])
  line[3] = parseInt(line[3])
  line[4] = parseInt(line[4])

  for (var i = line[1]; i < 0 + line[1] + line[3]; i++) {
    for (var j = line[2]; j < line[2] + line[4]; j++) {
      if (fabric[i][j] == 1) {
        overlaps++
      }
      fabric[i][j]++
    }
  }
})

lineReader.on('close', function () {
  console.log(overlaps)
})
