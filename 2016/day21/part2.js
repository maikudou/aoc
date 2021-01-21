var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var start = 'abcdefgh'.split('')

function swap(array, line) {
  const [, swapType, op1, op2] = /(letter|position) (\S+) with (?:letter|position) (\S+)/.exec(line)
  var swappedLetter
  if (swapType === 'position') {
    swappedLetter = array[op1]
    array[op1] = array[op2]
    array[op2] = swappedLetter
  } else {
    var index1 = array.indexOf(op1)
    var index2 = array.indexOf(op2)
    swappedLetter = array[index1]
    array[index1] = array[index2]
    array[index2] = swappedLetter
  }
  return array
}

function rotate(array, line) {
  const [
    ,
    rotateType,
    stepsOrLetter
  ] = /(based on position of letter|left|right) (\S)(?: steps)??/.exec(line)
  if (rotateType === 'left') {
    for (var i = 0; i < stepsOrLetter; i++) {
      array.push(array.shift())
    }
  } else if (rotateType === 'right') {
    for (var i = 0; i < stepsOrLetter; i++) {
      array.unshift(array.pop())
    }
  } else {
    var index = array.indexOf(stepsOrLetter)
    array.unshift(array.pop())
    for (var i = 0; i < index; i++) {
      array.unshift(array.pop())
    }
    if (index >= 4) {
      array.unshift(array.pop())
    }
  }
  return array
}

function unRotate(array, line) {
  const [
    ,
    rotateType,
    stepsOrLetter
  ] = /(based on position of letter|left|right) (\S)(?: steps)??/.exec(line)
  if (rotateType === 'left') {
    for (var i = 0; i < stepsOrLetter; i++) {
      array.unshift(array.pop())
    }
  } else if (rotateType === 'right') {
    for (var i = 0; i < stepsOrLetter; i++) {
      array.push(array.shift())
    }
  } else {
    var afterRotate = array.join('')
    while (true) {
      // eslint-disable-line
      array.push(array.shift())
      if (rotate(array.slice(0), line).join('') === afterRotate) {
        break
      }
    }
  }
  return array
}

function reverse(array, line) {
  var [, reverseStart, reverseEnd] = /positions (\d+) through (\d+)/.exec(line)
  reverseEnd = parseInt(reverseEnd, 10)
  reverseStart = parseInt(reverseStart, 10)
  array.splice(
    reverseStart,
    reverseEnd - reverseStart + 1,
    ...array.slice(reverseStart, reverseEnd + 1).reverse()
  )
  return array
}

function move(array, line) {
  const [, what, where] = /position (\d+) to position (\d+)/.exec(line)
  var spliced = array.splice(what, 1)
  array.splice(where, 0, spliced[0])
  return array
}
function unMove(array, line) {
  const [, what, where] = /position (\d+) to position (\d+)/.exec(line)
  var spliced = array.splice(where, 1)
  array.splice(what, 0, spliced[0])
  return array
}

const lines = []

lineReader.on('line', function (line) {
  const [, operation] = /^(rotate|move|swap|reverse) /.exec(line)
  lines.push(line)

  switch (operation) {
    case 'swap':
      var before = start.join('')
      start = swap(start, line)
      var after = start.join('')
      console.assert(before === swap(after.split(''), line).join(''))
      break
    case 'rotate':
      var before = start.join('')
      start = rotate(start, line)
      var after = start.join('')
      console.assert(
        before === unRotate(after.split(''), line).join(''),
        line,
        before,
        after,
        unRotate(after.split(''), line).join('')
      )
      break
    case 'reverse':
      var before = start.join('')
      start = reverse(start, line)
      var after = start.join('')
      console.assert(before === reverse(after.split(''), line).join(''))
      break
    case 'move':
      var before = start.join('')
      start = move(start, line)
      var after = start.join('')
      console.assert(before === unMove(after.split(''), line).join(''))
      break
  }
})

lineReader.on('close', function () {
  start = 'fbgdceah'.split('')

  for (var k = lines.length - 1; k >= 0; k--) {
    const [, operation] = /^(rotate|move|swap|reverse) /.exec(lines[k])
    switch (operation) {
      case 'swap':
        start = swap(start, lines[k])
        break
      case 'rotate':
        start = unRotate(start, lines[k])
        break
      case 'reverse':
        start = reverse(start, lines[k])
        break
      case 'move':
        start = unMove(start, lines[k])
        break
    }
  }

  console.log(start.join(''))
})
