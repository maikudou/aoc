const IntCode = require('../../utils/intcode')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let input

lineReader.on('line', function (line) {
  input = line
})

lineReader.on('close', function () {
  var max = 0

  for (var p1 = 0; p1 < 5; p1++) {
    for (var p2 = 0; p2 < 5; p2++) {
      if (p2 === p1) {
        continue
      }
      for (var p3 = 0; p3 < 5; p3++) {
        if (p3 === p1 || p3 === p2) {
          continue
        }
        for (var p4 = 0; p4 < 5; p4++) {
          if (p4 === p1 || p4 === p2 || p4 === p3) {
            continue
          }
          for (var p5 = 0; p5 < 5; p5++) {
            if (p5 === p1 || p5 === p2 || p5 === p3 || p5 === p4) {
              continue
            }
            var phases = [p1, p2, p3, p4, p5]
            var amplifiers = []

            for (var i = 0; i < 5; i++) {
              const turn = i
              const intCode = new IntCode(value => {
                if (turn === 4) {
                  max = Math.max(max, value)
                } else {
                  amplifiers[turn + 1].input(value)
                }
              })
              intCode.setMemory(input.split(',').map(num => parseInt(num, 10)))
              intCode.execute()
              amplifiers.push(intCode)
            }
            amplifiers[0].input(phases[0])
            amplifiers[1].input(phases[1])
            amplifiers[2].input(phases[2])
            amplifiers[3].input(phases[3])
            amplifiers[4].input(phases[4])
            amplifiers[0].input(0)
          }
        }
      }
    }
  }
  console.log(max)
})
