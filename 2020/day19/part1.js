var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let validatorsFinished = false
let validators = new Map()
let parsedValidators = new Map()
let validStrings = new Set()

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
        value = buildStrings(value)
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

lineReader.on('line', function (line) {
  if (!validatorsFinished) {
    if (!line) {
      validatorsFinished = true
      parseValidators()
      return
    }
    const [_, index, letter, links] = /^(\d+): (?:"(\w)"|([\d \|]+))$/.exec(line)
    validators.set(index, letter ? letter : links.split(' | ').map(links => links.split(' ')))
  } else {
    if (validStrings.has(line)) {
      count++
    }
  }
})

lineReader.on('close', function () {
  console.log(count)
})
