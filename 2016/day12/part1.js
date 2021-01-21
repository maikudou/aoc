var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const registers = {
  a: 0,
  b: 0,
  c: 0,
  d: 0
}
var instructions = []

lineReader.on('line', function (line) {
  const [
    ,
    instruction,
    operand1,
    operand2
  ] = /^(cpy|inc|dec|jnz) (\d+|[abcd])(?: (-?\d+|[abcd]))?$/.exec(line)
  instructions.push({
    instruction,
    operand1: isNaN(operand1) ? operand1 : parseInt(operand1, 10),
    operand2: isNaN(operand2) ? operand2 : parseInt(operand2, 10)
  })
})

function processInstructions(instructions, registers) {
  var currentIndex = 0
  var currentInstruction

  while (currentIndex < instructions.length) {
    currentInstruction = instructions[currentIndex]
    switch (currentInstruction.instruction) {
      case 'cpy':
        registers[currentInstruction.operand2] = isNaN(currentInstruction.operand1)
          ? registers[currentInstruction.operand1]
          : currentInstruction.operand1
        currentIndex++
        break
      case 'inc':
        registers[currentInstruction.operand1] = registers[currentInstruction.operand1] + 1
        currentIndex++
        break
      case 'dec':
        registers[currentInstruction.operand1] = registers[currentInstruction.operand1] - 1
        currentIndex++
        break
      case 'jnz':
        var checkingValue = isNaN(currentInstruction.operand1)
          ? registers[currentInstruction.operand1]
          : currentInstruction.operand1
        currentIndex += checkingValue ? currentInstruction.operand2 : 1
        break
    }
  }

  return registers.a
}

lineReader.on('close', function () {
  console.log(processInstructions(instructions, { a: 0, b: 0, c: 0, d: 0 }))
})
