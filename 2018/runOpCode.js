module.exports = function (opcode, op1, op2, op3, registers) {
  // console.log(opcode, op1, op2, op3, registers)
  switch (opcode) {
    case 'addr':
      registers[op3] = registers[op1] + registers[op2]
      break
    case 'addi':
      registers[op3] = registers[op1] + op2
      break
    case 'mulr':
      registers[op3] = registers[op1] * registers[op2]
      break
    case 'muli':
      registers[op3] = registers[op1] * op2
      break
    case 'banr':
      registers[op3] = registers[op1] & registers[op2]
      break
    case 'bani':
      registers[op3] = registers[op1] & op2
      break
    case 'borr':
      registers[op3] = registers[op1] | registers[op2]
      break
    case 'bori':
      registers[op3] = registers[op1] | op2
      break
    case 'setr':
      registers[op3] = registers[op1]
      break
    case 'seti':
      registers[op3] = op1
      break
    case 'gtir':
      registers[op3] = op1 > registers[op2] ? 1 : 0
      break
    case 'gtri':
      registers[op3] = registers[op1] > op2 ? 1 : 0
      break
    case 'gtrr':
      registers[op3] = registers[op1] > registers[op2] ? 1 : 0
      break
    case 'eqir':
      registers[op3] = op1 === registers[op2] ? 1 : 0
      break
    case 'eqri':
      registers[op3] = registers[op1] === op2 ? 1 : 0
      break
    case 'eqrr':
      registers[op3] = registers[op1] === registers[op2] ? 1 : 0
      break
  }
  // console.log(opcode, registers)
  return registers
}
