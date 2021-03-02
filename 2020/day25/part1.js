var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let card
let door

const transform = (value, subject) => {
  value = value * subject
  value = value % 20201227
  return value
}

lineReader.on('line', function (line) {
  if (card) {
    door = parseInt(line, 10)
  } else {
    card = parseInt(line, 10)
  }
})

lineReader.on('close', function () {
  let value = 1
  let cardLoopSize = 0
  while (value != card) {
    cardLoopSize++
    value = transform(value, 7)
  }
  value = 1
  for (var i = 0; i < cardLoopSize; i++) {
    value = transform(value, door)
  }
  console.log(value)
})
