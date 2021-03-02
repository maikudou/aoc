var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})
const toDecimal = require('../../utils/toDecimal')

let mode = 'fields'
let ticket
let nearby = []
let validators = []
let namedValidators = new Map()

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
    namedValidators.set(field, {
      v: [toDecimal(s1), toDecimal(e1), toDecimal(s2), toDecimal(e2)],
      fieldIndex: new Set()
    })
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
  const validNearby = nearby.filter(ticket => {
    return ticket.every(val => {
      const some = validators.some(validator => {
        return val >= validator[0] && val <= validator[1]
      })
      return some
    })
  })
  const namedValidatorsArray = Array.from(namedValidators.entries())
  for (var i = 0; i < ticket.length; i++) {
    namedValidatorsArray.map(nv => {
      const validator = nv[1].v
      if (
        validNearby.every(ticket => {
          const ticketValue = ticket[i]
          return (
            (validator[0] <= ticketValue && ticketValue <= validator[1]) ||
            (validator[2] <= ticketValue && ticketValue <= validator[3])
          )
        })
      ) {
        nv[1].fieldIndex.add(i)
      }
    })
  }
  let copyMap = new Map(namedValidatorsArray)
  let hasAmbuguity = true
  let hasOne = true
  while (hasAmbuguity && hasOne) {
    let iterator = copyMap.keys()
    let next = iterator.next()
    hasOne = false
    while (!next.done) {
      if (copyMap.get(next.value).fieldIndex.size == 1) {
        hasOne = true
        break
      }
      next = iterator.next()
    }
    if (hasOne) {
      hasAmbuguity = false
      const sureIndex = Array.from(copyMap.get(next.value).fieldIndex)[0]
      copyMap.delete(next.value)

      iterator = copyMap.values()
      next = iterator.next()
      while (!next.done) {
        next.value.fieldIndex.delete(sureIndex)
        if (next.value.fieldIndex.size > 1) {
          hasAmbuguity = true
        }
        next = iterator.next()
      }
    }
  }
  let result = 1
  for (var i = 0; i < 6; i++) {
    result *= ticket[Array.from(namedValidatorsArray[i][1].fieldIndex)[0]]
  }
  console.log(result)
})
