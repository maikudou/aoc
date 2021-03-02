const { parseInstruction, processInstructions } = require('../../utils/assembunny')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var instructions = []

lineReader.on('line', function (line) {
  instructions.push(parseInstruction(line))
})

lineReader.on('close', function () {
  console.log(processInstructions(instructions, { a: 12, b: 0, c: 0, d: 0 }))
})
