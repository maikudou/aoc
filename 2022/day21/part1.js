var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const monkeys = new Map()

function getMonkeyResult(name) {
  const monkey = monkeys.get(name)
  if (monkey.result !== null) {
    return monkey.result
  } else {
    let result
    switch (monkey.derive.operation) {
      case '+':
        result = getMonkeyResult(monkey.derive.op1) + getMonkeyResult(monkey.derive.op2)
        break
      case '-':
        result = getMonkeyResult(monkey.derive.op1) - getMonkeyResult(monkey.derive.op2)
        break
      case '*':
        result = getMonkeyResult(monkey.derive.op1) * getMonkeyResult(monkey.derive.op2)
        break
      case '/':
        result = getMonkeyResult(monkey.derive.op1) / getMonkeyResult(monkey.derive.op2)
        break
    }

    monkey.result = result
    return result
  }
}

lineReader.on('line', function (line) {
  const numRegExp = /(\w+)\: (\d+)/
  const derivedRegXep = /(\w+)\: (\w+) (.) (\w+)/
  if (numRegExp.test(line)) {
    const [_, name, result] = numRegExp.exec(line)
    monkeys.set(name, { result: parseInt(result, 10) })
  } else {
    const [_, name, op1, operation, op2] = derivedRegXep.exec(line)
    monkeys.set(name, {
      result: null,
      derive: {
        op1,
        op2,
        operation
      }
    })
  }
})

lineReader.on('close', function () {
  console.log(getMonkeyResult('root'))
})
