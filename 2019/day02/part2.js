const IntCode = require('../../utils/intcode')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let input
const output = 19690720

lineReader.on('line', function (line) {
  input = line
})

lineReader.on('close', function () {
  const intCode = new IntCode()
  for (var noun = 0; noun < 100; noun++) {
    for (var verb = 0; verb < 100; verb++) {
      intCode.setMemory(input.split(',').map(num => parseInt(num, 10)))
      intCode.setValueAt(1, noun)
      intCode.setValueAt(2, verb)
      intCode.execute()
      if (intCode.getValueAt(0) === output) {
        console.log(100 * noun + verb)
        process.exit(0)
      }
    }
  }
})
