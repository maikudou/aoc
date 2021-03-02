const IntCode = require('../../utils/intcode')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let input

lineReader.on('line', function (line) {
  input = line
})

lineReader.on('close', function () {
  const intCode = new IntCode()
  intCode.setMemory(input.split(',').map(num => parseInt(num, 10)))
  intCode.execute()
  intCode.input(1)
})
