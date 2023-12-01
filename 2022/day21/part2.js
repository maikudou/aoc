var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const monkeys = new Map()
let results = new Map()

function getMonkeyResult(name) {
  const monkey = monkeys.get(name)
  if (results.has(name)) {
    return results.get(name)
  } else {
    let result
    switch (monkey.operation) {
      case '+':
        result = getMonkeyResult(monkey.op1) + getMonkeyResult(monkey.op2)
        break
      case '-':
        result = getMonkeyResult(monkey.op1) - getMonkeyResult(monkey.op2)
        break
      case '*':
        result = getMonkeyResult(monkey.op1) * getMonkeyResult(monkey.op2)
        break
      case '/':
        result = getMonkeyResult(monkey.op1) / getMonkeyResult(monkey.op2)
        break
    }
    results.set(name, result)
    return result
  }
}

lineReader.on('line', function (line) {
  const numRegExp = /(\w+)\: (\d+)/
  const derivedRegXep = /(\w+)\: (\w+) (.) (\w+)/
  if (numRegExp.test(line)) {
    const [_, name, result] = numRegExp.exec(line)
    results.set(name, parseInt(result, 10))
  } else {
    const [_, name, op1, operation, op2] = derivedRegXep.exec(line)
    monkeys.set(name, {
      op1,
      op2,
      operation
    })
  }
})

lineReader.on('close', function () {
  const initialResults = new Map(Array.from(results.entries()))

  const derived = []
  const entries = Array.from(monkeys.entries())

  const toCheck = ['humn']
  const checked = new Set()

  let next2Check = toCheck.shift()
  while (next2Check) {
    entries
      .filter(([name, ops]) => ops.op1 === next2Check || ops.op2 === next2Check)
      .forEach(([name]) => {
        if (!checked.has(name)) {
          derived.push(name)
          toCheck.push(name)
        }
      })

    checked.add(next2Check)
    next2Check = toCheck.shift()
  }

  let prev = 0

  let humn = 0
  results.set('humn', humn)

  // save initial relation between left and right operand, derived one steadily grows/shrinks
  const diff = getMonkeyResult(monkeys.get('root').op1) > getMonkeyResult(monkeys.get('root').op2)

  // find approximate large value when it changes enough to reverse which is larger
  while (true) {
    derived.forEach(name => results.delete(name))
    results.set('humn', humn)
    prev = getMonkeyResult(monkeys.get('root').op1)
    if (
      getMonkeyResult(monkeys.get('root').op1) > getMonkeyResult(monkeys.get('root').op2) !==
      diff
    ) {
      break
    }
    humn += 10000000000
  }

  // and binary search from here, it's fast
  let left = humn - 10000000000
  let right = humn
  let middle = Math.round((right - left) / 2)
  while (left < right) {
    middle = left + Math.round((right - left) / 2)
    if (middle === right || middle === left) {
      break
    }
    derived.forEach(name => results.delete(name))
    results.set('humn', middle)
    if (getMonkeyResult(monkeys.get('root').op1) === getMonkeyResult(monkeys.get('root').op2)) {
      console.log(middle)
      break
    }
    if (
      getMonkeyResult(monkeys.get('root').op1) > getMonkeyResult(monkeys.get('root').op2) !==
      diff
    ) {
      right = middle
    } else {
      left = middle
    }
  }
})
