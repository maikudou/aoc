var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let x = 1
let tick = 0
let strength = 0
const program = []

lineReader.on('line', function (line) {
  const [_, op, operand] = /(\S+) ?(\-?\d+)?/.exec(line)

  program.push([op, operand])
})

lineReader.on('close', function () {
  let addStartedAt = null
  let add = 0
  let op = program.shift()
  let row = ''
  while (program.length) {
    if (tick && !(tick % 40)) {
      process.stdout.write('\n')
    }
    if (Math.abs((tick % 40) - x) < 2) {
      process.stdout.write('#')
    } else {
      process.stdout.write('.')
    }
    if (op[0] === 'addx') {
      if (addStartedAt === null) {
        addStartedAt = tick
        add = parseInt(op[1], 10)
      } else if (tick - addStartedAt === 1) {
        x += add
        addStartedAt = null
        op = program.shift()
      }
    } else {
      op = program.shift()
    }
    tick++
  }
  const ticksToLine = 40 - (tick % 40)
  for (let i = 0; i < ticksToLine; i++) {
    if (Math.abs((tick % 40) - x) < 2) {
      process.stdout.write('#')
    } else {
      process.stdout.write('.')
    }
    tick++
  }
  process.stdout.write('\n')
})
