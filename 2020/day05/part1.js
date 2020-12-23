var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let max = 0

lineReader.on('line', function (line) {
  let low = 0
  let high = 127
  let row
  for (var i = 0; i < 8; i++) {
    if (line[i] == 'F') {
      high = low + Math.floor((high - low) / 2)
    } else {
      low = low + Math.ceil((high - low) / 2)
    }
    row = low
  }

  low = 0
  high = 7
  let seat
  for (var i = 7; i < 10; i++) {
    if (line[i] == 'L') {
      high = low + Math.floor((high - low) / 2)
    } else {
      low = low + Math.ceil((high - low) / 2)
    }
    seat = low
  }
  max = Math.max(max, row * 8 + seat)
})

lineReader.on('close', function () {
  console.log(max)
})
