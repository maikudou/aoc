var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/test2')
})

let validatorsFinished = false
let validators = new Map()
let parsedValidators = new Map()
let validStrings = new Set()
const lines = []

const parseValidators = () => {
  validStrings = new Set(buildStrings('0'))
}

const buildStrings = index => {
  const rules = validators.get(index)
  if (!Array.isArray(rules)) {
    return [rules]
  } else {
    let variants = []
    rules.map(rule => {
      let strings = rule.reduce((acc, value) => {
        if (value == index) {
          console.log('recursion', rule, acc)
          value = [`rec${value}`]
        } else {
          value = buildStrings(value)
        }
        if (acc.length) {
          const newAcc = []
          value.map(otherValue => {
            return acc.map(exValue => {
              newAcc.push(exValue + otherValue)
            })
          })
          acc = newAcc
        } else {
          acc = value
        }
        return acc
      }, [])
      variants = variants.concat(strings)
    })
    return variants
  }
}

let count = 0
let maxLine = 0

lineReader.on('line', function (line) {
  if (!validatorsFinished) {
    if (!line) {
      validatorsFinished = true
      return
    }
    const [_, index, letter, links] = /^(\d+): (?:"(\w)"|([\d \|]+))$/.exec(line)
    validators.set(index, letter ? letter : links.split(' | ').map(links => links.split(' ')))
  } else {
    lines.push(line)
    maxLine = Math.max(maxLine, line.length)
  }
})

lineReader.on('close', function () {
  console.log(maxLine)
  parseValidators()
  // console.log(validStrings)
  console.log(count)
})
