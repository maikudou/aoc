const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

function findExplodable(snailNumber, depth = 0) {
  if (depth == 4) {
    return snailNumber
  }
  const left = Array.isArray(snailNumber.value[0].value)
    ? findExplodable(snailNumber.value[0], depth + 1)
    : null
  const right = Array.isArray(snailNumber.value[1].value)
    ? findExplodable(snailNumber.value[1], depth + 1)
    : null

  return left || right
}

function findSplittable(snailNumber) {
  const left = Array.isArray(snailNumber.value[0].value)
    ? findSplittable(snailNumber.value[0])
    : snailNumber.value[0] > 9
    ? snailNumber
    : false

  const right = Array.isArray(snailNumber.value[1].value)
    ? findSplittable(snailNumber.value[1])
    : snailNumber.value[1] > 9
    ? snailNumber
    : false

  return left || right
}

function findLeftNumber(snailNumber) {
  if (!snailNumber || !snailNumber.parent) {
    return null
  }
  const left = snailNumber.parent.value[0]
  if (left == snailNumber) {
    return findLeftNumber(snailNumber.parent)
  } else if (Array.isArray(left.value)) {
    return findRightNumberDown(left)
  } else {
    return snailNumber.parent.value
  }
}
function findLeftNumberDown(snailNumber) {
  if (Array.isArray(snailNumber.value[0].value)) {
    return findLeftNumberDown(snailNumber.value[0])
  } else {
    return snailNumber.value
  }
}
function findRightNumber(snailNumber) {
  if (!snailNumber || !snailNumber.parent) {
    return null
  }
  const right = snailNumber.parent.value[1]
  if (right == snailNumber) {
    return findRightNumber(snailNumber.parent)
  } else if (Array.isArray(right.value)) {
    return findLeftNumberDown(right)
  } else {
    return snailNumber.parent.value
  }
}
function findRightNumberDown(snailNumber) {
  if (Array.isArray(snailNumber.value[1].value)) {
    return findRightNumberDown(snailNumber.value[1])
  } else {
    return snailNumber.value
  }
}

function reduce(snailNumber) {
  let it = 0
  let explodable = findExplodable(snailNumber)
  let splittable = explodable ? null : findSplittable(snailNumber)
  while (explodable || splittable) {
    if (explodable) {
      const pair = explodable.value
      let left = findLeftNumber(explodable)
      let right = findRightNumber(explodable)
      if (left) {
        left[Array.isArray(left[1].value) ? 0 : 1] += pair[0]
      }
      if (right) {
        right[Array.isArray(right[0].value) ? 1 : 0] += pair[1]
      }
      if (explodable.parent.value[0] == explodable) {
        explodable.parent.value[0] = 0
      } else {
        explodable.parent.value[1] = 0
      }
      explodable = findExplodable(snailNumber)
      splittable = explodable ? null : findSplittable(snailNumber)
      continue
    }
    if (splittable) {
      it++
      let newValue
      if (splittable.value[0] > 9) {
        newValue = [Math.floor(splittable.value[0] / 2), Math.ceil(splittable.value[0] / 2)]
      } else {
        newValue = [Math.floor(splittable.value[1] / 2), Math.ceil(splittable.value[1] / 2)]
      }
      splittable.value[splittable.value[0] > 9 ? 0 : 1] = {
        parent: splittable,
        value: newValue
      }
      explodable = findExplodable(snailNumber)
      splittable = explodable ? null : findSplittable(snailNumber)
    }
  }
  return snailNumber
}

function magnitude(snailNumber) {
  const left = snailNumber.value[0]
  const right = snailNumber.value[1]
  return 3 * (left.value ? magnitude(left) : left) + 2 * (right.value ? magnitude(right) : right)
}

function render(snailNumber) {
  const left = Array.isArray(snailNumber.value[0].value)
    ? render(snailNumber.value[0])
    : snailNumber.value[0]
  const right = Array.isArray(snailNumber.value[1].value)
    ? render(snailNumber.value[1])
    : snailNumber.value[1]

  return `[${left},${right}]`
}

function parse(chars) {
  let current = null
  let top = null

  chars.split('').forEach(char => {
    switch (char) {
      case '[':
        const newOne = {
          parent: current,
          value: []
        }
        if (current) {
          current.value.push(newOne)
        }
        current = newOne
        break
      case ']':
        top = current.parent || current
        current = current.parent
        break
      case ',':
        break
      default:
        current.value.push(toDecimal(char))
        break
    }
  })

  return top
}

let currentSum = null

lineReader.on('line', function (line) {
  if (currentSum) {
    currentSum = render(reduce(parse(`[${currentSum},${line}]`)))
  } else {
    currentSum = render(reduce(parse(line)))
  }
})

lineReader.on('close', function () {
  console.log(magnitude(parse(currentSum)))
})
