var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let transmission

lineReader.on('line', function (line) {
  transmission = line
    .split('')
    .map(c => parseInt(c, 16))
    .map(n => n.toString(2))
    .map(s => s.padStart(4, '0'))
    .map(s => s.split(''))
    .flat()
})

function parsePackets(bits) {
  let bitsShifted = 0
  const packetVersion = parseInt(bits.splice(0, 3).join(''), 2)
  const packetType = parseInt(bits.splice(0, 3).join(''), 2)
  bitsShifted += 6
  let value
  if (packetType === 4) {
    const valueBits = []
    while (bits.shift() === '1') {
      valueBits.push(bits.splice(0, 4))
      bitsShifted += 5
    }
    valueBits.push(bits.splice(0, 4))
    bitsShifted += 5
    value = parseInt(valueBits.flat().join(''), 2)
  } else {
    const lengthType = parseInt(bits.shift(), 2)
    bitsShifted += 1
    const subPacketValues = []
    if (lengthType) {
      const subPaketsNumber = parseInt(bits.splice(0, 11).join(''), 2)
      bitsShifted += 11
      let subPacketsParsed = 0
      while (subPacketsParsed < subPaketsNumber) {
        subPacketsParsed++
        const parsed = parsePackets(bits)
        bitsShifted += parsed.bitsShifted
        subPacketValues.push(parsed.value)
      }
    } else {
      const length = parseInt(bits.splice(0, 15).join(''), 2)
      bitsShifted += 15
      let subBitsShifted = 0
      while (subBitsShifted < length) {
        const parsed = parsePackets(bits)
        subBitsShifted += parsed.bitsShifted
        subPacketValues.push(parsed.value)
      }
      bitsShifted += subBitsShifted
    }
    switch (packetType) {
      case 0:
        value = subPacketValues.reduce((acc, value) => acc + value, 0)
        break
      case 1:
        value = subPacketValues.reduce((acc, value) => acc * value, 1)
        break
      case 2:
        value = subPacketValues.reduce((acc, value) => Math.min(acc, value), Infinity)
        break
      case 3:
        value = subPacketValues.reduce((acc, value) => Math.max(acc, value), 0)
        break
      case 5:
        value = subPacketValues[0] > subPacketValues[1] ? 1 : 0
        break
      case 6:
        value = subPacketValues[0] < subPacketValues[1] ? 1 : 0
        break
      case 7:
        value = subPacketValues[0] == subPacketValues[1] ? 1 : 0
        break
    }
  }
  return { bitsShifted, value }
}

lineReader.on('close', function () {
  console.log(parsePackets(transmission).value)
})
