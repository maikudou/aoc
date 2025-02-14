const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const codes = []

const numbersPaths = {
  A: {
    0: ['<'],
    1: ['^<<', '<^<'],
    2: ['^<', '<^'],
    3: ['^'],
    4: ['^^<<', '^<^<', '<^^<', '<^<^'],
    5: ['^^<', '<^^', '^<^'],
    6: ['^^'],
    7: ['^^^<<', '^^<^<', '^^<<^', '^<^^<', '^<^<^', '^<<^^', '<^^^<', '<^^<^', '<^<^^'],
    8: ['^^^<', '^^<^', '^<^^', '<^^^'],
    9: ['^^^']
  },
  0: {
    A: ['>'],
    1: ['^<'],
    2: ['^'],
    3: ['^>', '>^'],
    4: ['^^<', '^<^'],
    5: ['^^'],
    6: ['^^>', '^>^', '>^^'],
    7: ['^^^<', '^^<^', '^<^^'],
    8: ['^^^'],
    9: ['^^^>', '^^>^', '^>^^', '>^^^']
  },
  1: {
    A: ['>>v', '>v>'],
    0: ['>v'],
    2: ['>'],
    3: ['>>'],
    4: ['^'],
    5: ['^>', '>^'],
    6: ['^>>', '>^>', '>>^'],
    7: ['^^'],
    8: ['^^>', '^>^', '>^^'],
    9: ['^^>>', '^>^>', '^>>^', '>^>^', '>^^>', '>>^^']
  },
  2: {
    A: ['>v', 'v>'],
    0: ['v'],
    1: ['<'],
    3: ['>'],
    4: ['^<', '<^'],
    5: ['^'],
    6: ['^>', '>^'],
    7: ['^^<', '^<^', '<^^'],
    8: ['^^'],
    9: ['^^>', '^>^', '>^^']
  },
  3: {
    A: ['v'],
    0: ['<v', 'v<'],
    1: ['<<'],
    2: ['<'],
    4: ['<<^', '<^<', '^<<'],
    5: ['<^', '^<'],
    6: ['^'],
    7: ['^^<<', '^<^<', '^<<^', '<^^<', '<^<^', '<<^^'],
    8: ['^^<', '^<^', '<^^'],
    9: ['^^']
  },
  4: {
    A: ['>>vv', '>v>v', '>vv>', 'v>>v', 'v>v>'],
    0: ['>vv', 'v>v'],
    1: ['v'],
    2: ['>v', 'v>'],
    3: ['>>v', '>v>', 'v>>'],
    5: ['>'],
    6: ['>>'],
    7: ['^'],
    8: ['^>', '>^'],
    9: ['^>>', '>^>', '>>^']
  },
  5: {
    A: ['>vv', 'v>v', 'vv>'],
    0: ['vv'],
    1: ['v<', '<v'],
    2: ['v'],
    3: ['v>', '>v'],
    4: ['<'],
    6: ['>'],
    7: ['^<', '<^'],
    8: ['^'],
    9: ['^>', '>^']
  },
  6: {
    A: ['vv'],
    0: ['<vv', 'v<v', 'vv<'],
    1: ['<<v', '<v<', 'v<<'],
    2: ['<v', 'v<'],
    3: ['v'],
    4: ['<<'],
    5: ['<'],
    7: ['<<^', '<^<', '^<<'],
    8: ['<^', '^<'],
    9: ['^']
  },
  7: {
    A: ['>>vvv', '>v>vv', '>vv>v', '>vvv>', 'v>>vv', 'v>v>v', 'v>vv>', 'vv>>v', 'vv>v>'],
    0: ['>vvv', 'v>vv', 'vv>v'],
    1: ['vv'],
    2: ['>vv', 'v>v', 'vv>'],
    3: ['>>vv', '>v>v', 'v>>v', 'v>v>', 'vv>>', '>vv>'],
    4: ['v'],
    5: ['>v', 'v>'],
    6: ['>>v', '>v>', 'v>>'],
    8: ['>'],
    9: ['>>']
  },
  8: {
    A: ['>vvv', 'v>vv', 'vv>v', 'vvv>'],
    0: ['vvv'],
    1: ['vv<', 'v<v', '<vv'],
    2: ['vv'],
    3: ['vv>', 'v>v', '>vv'],
    4: ['<v', 'v<'],
    5: ['v'],
    6: ['v>', '>v'],
    7: ['<'],
    9: ['>']
  },
  9: {
    A: ['vvv'],
    0: ['<vvv', 'v<vv', 'vv<v', 'vvv<'],
    1: ['<<vv', '<v<v', 'v<<v', 'v<v<', 'vv<<', '<vv<'],
    2: ['<vv', 'v<v', 'vv<'],
    3: ['vv'],
    4: ['<<v', '<v<', 'v<<'],
    5: ['<v', 'v<'],
    6: ['v'],
    7: ['<<'],
    8: ['<']
  }
}

const cursorPaths = {
  A: {
    '^': ['<'],
    '>': ['v'],
    v: ['<v', 'v<'],
    '<': ['v<<', '<v<']
  },
  '^': {
    A: ['>'],
    '>': ['>v', 'v>'],
    v: ['v'],
    '<': ['v<']
  },
  '>': {
    A: ['^'],
    '^': ['<^', '^<'],
    v: ['<'],
    '<': ['<<']
  },
  v: {
    A: ['>^', '^>'],
    '^': ['^'],
    '>': ['>'],
    '<': ['<']
  },
  '<': {
    A: ['>>^', '>^>'],
    '^': ['>^'],
    '>': ['>>'],
    v: ['>']
  }
}

function codeToCursor(code) {
  console.log(code)
  let pos = 'A'
  const firstCursorPath = code
    .split('')
    .map(char => {
      const path = getPath(char, pos)
      pos = char
      return `${path}A`
    })
    .join('')
  console.log(firstCursorPath)

  pos = 'A'
  const secondCursorPath = firstCursorPath
    .split('')
    .map(char => {
      const path = cursorPaths[pos][char] || ''
      pos = char
      return `${path}A`
    })
    .join('')

  console.log(secondCursorPath)

  pos = 'A'
  const thirdCursorPath = secondCursorPath
    .split('')
    .map(char => {
      const path = cursorPaths[pos][char] || ''
      pos = char
      return `${path}A`
    })
    .join('')

  console.log(thirdCursorPath)

  console.log()

  return thirdCursorPath
}

lineReader.on('line', function (line) {
  codes.push(line)
})

lineReader.on('close', function () {
  let sum = 0

  codes.map(code => {
    const options = Array.from(
      new Set(
        code.split('').reduce(
          (acc, char) => {
            const options = []
            acc.options.forEach(value => {
              numbersPaths[acc.pos][char].forEach(p => {
                options.push(`${value}${p}A`)
              })
            })
            return { pos: char, options }
          },
          { pos: 'A', options: [''] }
        ).options
      )
    )

    options.sort((a, b) => a.length - b.length)

    let robotOptions = options

    for (var i = 0; i < 2; i++) {
      robotOptions = robotOptions
        .filter(a => a.length === robotOptions[0].length)
        .reduce((acc, value) => {
          const a = value.split('').reduce(
            (acc, char) => {
              const options = []
              acc.options.forEach(value => {
                if (acc.pos === char) {
                  options.push(`${value}A`)
                } else {
                  cursorPaths[acc.pos][char].forEach(p => {
                    options.push(`${value}${p}A`)
                  })
                }
              })
              return { pos: char, options }
            },
            { pos: 'A', options: [''] }
          ).options

          return acc.concat(a)
        }, [])

      robotOptions.sort((a, b) => a.length - b.length)
    }
    sum += toDecimal(code) * robotOptions[0].length
  })
  console.log(sum)
})
