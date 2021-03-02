var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let validatorsFinished = false
let validators = new Map()

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
let strings42
let strings42size
let strings31
let strings31size

lineReader.on('line', function (line) {
  if (!validatorsFinished) {
    if (!line) {
      validatorsFinished = true
      strings42 = buildStrings('42')
      strings42size = strings42[0].length
      strings42 = new Set(strings42)
      strings31 = buildStrings('31')
      strings31size = strings31[0].length
      strings31 = new Set(strings31)
      return
    }
    const [_, index, letter, links] = /^(\d+): (?:"(\w)"|([\d \|]+))$/.exec(line)
    validators.set(index, letter ? letter : links.split(' | ').map(links => links.split(' ')))
  } else {
    if (line.length == strings42size + strings42size + strings31size) {
      if (
        strings42.has(line.substring(0, strings42size)) &&
        strings42.has(line.substring(strings42size, strings42size * 2)) &&
        strings31.has(line.substring(line.length - strings31size))
      ) {
        count++
      }
    }
  }
})

lineReader.on('close', function () {
  console.log(count)
})
