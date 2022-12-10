var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let x = 1
let tick = 0
let strength = 0

lineReader.on('line', function (line) {
  const [_, op, operand] = /(\S+) ?(\-?\d+)?/.exec(line)

  if (tick < 220) {
    if (!((tick - 19) % 40)) {
      strength += (tick + 1) * x
    } else if ((tick - 19) % 40 === 39 && op == 'addx') {
      strength += (tick + 2) * x
    }
  }
  if (op === 'noop') {
    tick++
  } else {
    tick += 2
    x += parseInt(operand, 10)
  }
})

lineReader.on('close', function () {
  console.log(strength)
})
