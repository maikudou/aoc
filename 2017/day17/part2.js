var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let input

lineReader.on('line', function (line) {
  input = parseInt(line, 10)
})

lineReader.on('close', function () {
  let currentCandidate = {
    value: 0,
    next: null
  }

  current = currentCandidate
  current.next = current
  let zero = current

  for (let i = 0; i < 50000000; i++) {
    for (let j = 0; j < input; j++) {
      current = current.next
    }
    let next = {
      value: i + 1,
      next: current.next
    }
    current.next = next
    current = next
  }

  console.log(zero.next.value)
})
