const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const monkeyRE = /Monkey (\d+)/
const startingItemsRE = /Starting items: (.+)$/
const operationRE = /Operation: new = (\S+) ([+*]) (\S+)$/
const testRE = /Test: divisible by (\d+)$/
const ifTrueRE = /If true: throw to monkey (\d+)$/
const ifFalseRE = /If false: throw to monkey (\d+)$/

const monkeys = []

lineReader.on('line', function (line) {
  if (monkeyRE.test(line)) {
    monkeys.push({ inspected: 0 })
  } else if (startingItemsRE.test(line)) {
    const [_, startingItems] = startingItemsRE.exec(line)
    monkeys[monkeys.length - 1].items = startingItems.split(', ').map(toDecimal)
  } else if (operationRE.test(line)) {
    const [_, operand1, operation, operand2] = operationRE.exec(line)
    monkeys[monkeys.length - 1].operation = [operand1, operand2, operation]
  } else if (testRE.test(line)) {
    const [_, devisibleBy] = testRE.exec(line)
    monkeys[monkeys.length - 1].devisibleBy = toDecimal(devisibleBy)
  } else if (ifTrueRE.test(line)) {
    const [_, ifTrue] = ifTrueRE.exec(line)
    monkeys[monkeys.length - 1].ifTrue = toDecimal(ifTrue)
  } else if (ifFalseRE.test(line)) {
    const [_, ifFalse] = ifFalseRE.exec(line)
    monkeys[monkeys.length - 1].ifFalse = toDecimal(ifFalse)
  }
})

lineReader.on('close', function () {
  for (let i = 0; i < 20; i++) {
    monkeys.forEach(monkey => {
      let item
      while ((item = monkey.items.shift())) {
        monkey.inspected++
        const operand1 = monkey.operation[0] === 'old' ? item : toDecimal(monkey.operation[0])
        const operand2 = monkey.operation[1] === 'old' ? item : toDecimal(monkey.operation[1])
        let level = Math.floor(
          (monkey.operation[2] === '*' ? operand1 * operand2 : operand1 + operand2) / 3
        )
        monkeys[level % monkey.devisibleBy === 0 ? monkey.ifTrue : monkey.ifFalse].items.push(level)
      }
    })
  }
  console.log(
    monkeys
      .sort((a, b) => b.inspected - a.inspected)
      .map(monkey => monkey.inspected)
      .reduce((acc, value, index) => (index < 2 ? acc * value : acc), 1)
  )
})
