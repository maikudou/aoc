const IntCode = require('../../utils/intcode')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let input

lineReader.on('line', function (line) {
  input = line
})

lineReader.on('close', function () {
  const intCode2 = new IntCode()
  intCode2.setMemory(input.split(',').map(num => parseInt(num, 10)))
  intCode2.execute()
  intCode2.input(2)
})
