var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const mem = new Map()
let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'.split('')

lineReader.on('line', function (line) {
  const [_, newMask, address, value] = /^mask = (\w{36})|mem\[(\d+)\] = (\d+)$/.exec(line)
  if (newMask) {
    mask = newMask.split('')
  } else {
    let remainingValue = parseInt(value, 10)

    const binaryValue = '000000000000000000000000000000000000'.split('')
    let index = 35

    while (remainingValue > 0) {
      let remainder = remainingValue % 2
      binaryValue[index] = mask[index] == 'X' ? remainder : mask[index]
      remainingValue -= remainder
      remainingValue = remainingValue / 2
      index--
    }
    while (index > -1) {
      binaryValue[index] = mask[index] == 'X' ? 0 : mask[index]
      index--
    }
    // console.log(value, '\t', binaryValue.join(''))
    mem.set(address, binaryValue)
  }
})

lineReader.on('close', function () {
  const sum = Array.from(mem.values()).reduce((acc, value) => {
    return (
      acc +
      value.reduce((acc, value, index) => {
        return acc + value * Math.pow(2, 35 - index)
      }, 0)
    )
  }, 0)
  console.log(sum)
})
