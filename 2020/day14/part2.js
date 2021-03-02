var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const mem = new Map()
let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'.split('')

function defloat(address) {
  var acc = []
  for (var i = 0; i < address.length; i++) {
    if (address[i] == 'X') {
      break
    }
  }
  if (i < address.length) {
    const left = address.slice(0)
    left[i] = 0
    const right = address.slice(0)
    right[i] = 1
    acc = acc.concat(defloat(left))
    acc = acc.concat(defloat(right))
  } else {
    return [address]
  }
  return acc
}

lineReader.on('line', function (line) {
  const [_, newMask, address, value] = /^mask = (\w{36})|mem\[(\d+)\] = (\d+)$/.exec(line)
  if (newMask) {
    mask = newMask.split('')
  } else {
    let remainingValue = parseInt(address, 10)

    const binaryAddress = '000000000000000000000000000000000000'.split('')
    let index = 35

    while (remainingValue > 0) {
      let remainder = remainingValue % 2
      binaryAddress[index] = mask[index] == '0' ? remainder : mask[index] == '1' ? 1 : 'X'
      remainingValue -= remainder
      remainingValue = remainingValue / 2
      index--
    }
    while (index > -1) {
      binaryAddress[index] = mask[index] == '0' ? 0 : mask[index] == '1' ? 1 : 'X'
      index--
    }
    defloat(binaryAddress).map(address => {
      mem.set(address.join(''), parseInt(value, 10))
    })
  }
})

lineReader.on('close', function () {
  const sum = Array.from(mem.values()).reduce((acc, value) => {
    return acc + value
  }, 0)
  console.log(sum)
})
