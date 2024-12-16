var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const machines = [
  {
    a: {},
    b: {},
    prize: {}
  }
]

lineReader.on('line', function (line) {
  if (line) {
    if (/Button A:/.test(line)) {
      const [_, x, y] = /Button A: X\+(\d+), Y\+(\d+)/.exec(line)
      machines[machines.length - 1].a = { x, y }
    } else if (/Button B:/.test(line)) {
      const [_, x, y] = /Button B: X\+(\d+), Y\+(\d+)/.exec(line)
      machines[machines.length - 1].b = { x, y }
    } else {
      const [_, x, y] = /Prize: X\=(\d+), Y\=(\d+)/.exec(line)
      machines[machines.length - 1].prize = {
        x: parseInt(x, 10) + 10000000000000,
        y: parseInt(y, 10) + 10000000000000
      }
    }
  } else {
    machines.push({ a: {}, b: {}, prize: {} })
  }
})

lineReader.on('close', function () {
  let sum = 0
  machines.forEach(machine => {
    const y =
      (machine.a.x * machine.prize.y - machine.a.y * machine.prize.x) /
      (machine.a.x * machine.b.y - machine.a.y * machine.b.x)

    if (Math.floor(y) === y) {
      const x = (machine.prize.x - machine.b.x * y) / machine.a.x
      if (Math.floor(x) === x) {
        sum += y + x * 3
      }
    }
  })

  console.log(sum)
})
