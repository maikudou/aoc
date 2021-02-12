var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var instructions = []

lineReader.on('line', function (line) {
  const [
    ,
    instruction,
    operand1,
    operand2
  ] = /^(cpy|inc|dec|jnz|tgl) (-?\d+|[abcd])(?: (-?\d+|[abcd]))?$/.exec(line)
  instructions.push({
    instruction,
    operand1: isNaN(operand1) ? operand1 : parseInt(operand1, 10),
    operand2: isNaN(operand2) ? operand2 : parseInt(operand2, 10)
  })
})

const jumps = {}

function processInstructions(instructions, registers) {
  var currentIndex = 0
  var currentInstruction

  while (currentIndex < instructions.length) {
    currentInstruction = instructions[currentIndex]
    switch (currentInstruction.instruction) {
      case 'cpy':
        if (isNaN(currentInstruction.operand2)) {
          registers[currentInstruction.operand2] = isNaN(currentInstruction.operand1)
            ? registers[currentInstruction.operand1]
            : currentInstruction.operand1
        }
        currentIndex++
        break
      case 'inc':
        if (isNaN(currentInstruction.operand1)) {
          registers[currentInstruction.operand1] = registers[currentInstruction.operand1] + 1
        }
        currentIndex++
        break
      case 'dec':
        if (isNaN(currentInstruction.operand1)) {
          registers[currentInstruction.operand1] = registers[currentInstruction.operand1] - 1
        }
        currentIndex++
        break
      case 'jnz':
        var checkingValue = isNaN(currentInstruction.operand1)
          ? registers[currentInstruction.operand1]
          : currentInstruction.operand1
        var secondValue = isNaN(currentInstruction.operand2)
          ? registers[currentInstruction.operand2]
          : currentInstruction.operand2

        // Check if we check for register, not constant
        if (isNaN(currentInstruction.operand1)) {
          if (!jumps[currentIndex]) {
            // set the intial values on start of cycle
            jumps[currentIndex] = { ...registers }
          } else {
            // it's the second iteration of the same cycle
            // Check what changed
            const changesDuringCycle = {
              a: registers.a - jumps[currentIndex].a,
              b: registers.b - jumps[currentIndex].b,
              c: registers.c - jumps[currentIndex].c,
              d: registers.d - jumps[currentIndex].d
            }

            // Set values after checked operand value becames 0
            // after x iterations where x is value if that operand, checkingValue
            if (changesDuringCycle[currentInstruction.operand1] == -1) {
              if (changesDuringCycle.a) {
                registers.a += changesDuringCycle.a * checkingValue
              }
              if (changesDuringCycle.b) {
                registers.b += changesDuringCycle.b * checkingValue
              }
              if (changesDuringCycle.c) {
                registers.c += changesDuringCycle.c * checkingValue
              }
              if (changesDuringCycle.d) {
                registers.d += changesDuringCycle.d * checkingValue
              }
            }
            checkingValue = 0
            delete jumps[currentIndex]
          }
        }

        currentIndex += checkingValue ? secondValue : 1
        break
      case 'tgl':
        var toggleValue = isNaN(currentInstruction.operand1)
          ? registers[currentInstruction.operand1]
          : currentInstruction.operand1

        const toggleSubject = instructions[currentIndex + toggleValue]
        if (toggleSubject) {
          if (toggleSubject.operand2 == undefined) {
            toggleSubject.instruction = toggleSubject.instruction == 'inc' ? 'dec' : 'inc'
          } else if (toggleSubject.instruction != 'tgl') {
            toggleSubject.instruction = toggleSubject.instruction == 'jnz' ? 'cpy' : 'jnz'
          } else {
            toggleSubject.instruction = 'inc'
          }
        }
        currentIndex++
        break
    }
  }

  return registers.a
}

lineReader.on('close', function () {
  console.log(processInstructions(instructions, { a: 12, b: 0, c: 0, d: 0 }))
})
