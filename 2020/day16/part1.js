var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})
const toDecimal = require('../../utils/toDecimal')

let mode = 'fields'
let ticket
let nearby = []
let validators = []

lineReader.on('line', function (line) {
  if (!line) {
    return
  }
  if (line == 'your ticket:') {
    mode = 'ticket'
    return
  }
  if (line == 'nearby tickets:') {
    mode = 'nearby'
    return
  }
  if (mode == 'fields') {
    const [_, field, s1, e1, s2, e2] = /^([a-z ]+): (\d+)-(\d+) or (\d+)-(\d+)$/.exec(line)
    validators.push([toDecimal(s1), toDecimal(e1)])
    validators.push([toDecimal(s2), toDecimal(e2)])
    return
  }
  if (mode == 'ticket') {
    ticket = line.split(',').map(toDecimal)
    return
  }
  if (mode == 'nearby') {
    nearby.push(line.split(',').map(toDecimal))
    return
  }
})

lineReader.on('close', function () {
  console.log(
    nearby.reduce((acc, value) => {
      value.map(val => {
        if (
          !validators.some(validator => {
            return val >= validator[0] && val <= validator[1]
          })
        ) {
          acc += val
        }
      })
      return acc
    }, 0)
  )
})
