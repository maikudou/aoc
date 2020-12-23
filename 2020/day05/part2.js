var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let ids = new Set()
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

  ids.add(row * 8 + seat)
})

lineReader.on('close', function () {
  idsArray = Array.from(ids.values()).sort((a, b) => (a > b ? 1 : -1))
  // console.log(idsArray)
  for (var i = 0; i < idsArray.length; i++) {
    // console.log(idsArray[i], idsArray[i + 1])
    if (idsArray[i + 1] == idsArray[i] + 2) {
      console.log(idsArray[i] + 1)
    }
  }
})
