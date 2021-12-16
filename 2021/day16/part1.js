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

let versionSum = 0

function parsePackets(bits) {
  let bitsShifted = 0
  const packetVersion = parseInt(bits.splice(0, 3).join(''), 2)
  versionSum += packetVersion
  const packetType = parseInt(bits.splice(0, 3).join(''), 2)
  bitsShifted += 6
  if (packetType === 4) {
    const valueBits = []
    while (bits.shift() === '1') {
      valueBits.push(bits.splice(0, 4))
      bitsShifted += 5
    }
    valueBits.push(bits.splice(0, 4))
    bitsShifted += 5
    const value = parseInt(valueBits.flat().join(''), 2)
  } else {
    const lengthType = parseInt(bits.shift(), 2)
    bitsShifted += 1
    if (lengthType) {
      const subPaketsNumber = parseInt(bits.splice(0, 11).join(''), 2)
      bitsShifted += 11
      let subPacketsParsed = 0
      while (subPacketsParsed < subPaketsNumber) {
        subPacketsParsed++
        bitsShifted += parsePackets(bits)
      }
    } else {
      const length = parseInt(bits.splice(0, 15).join(''), 2)
      bitsShifted += 15
      let subBitsShifted = 0
      while (subBitsShifted < length) {
        subBitsShifted += parsePackets(bits)
      }
      bitsShifted += subBitsShifted
    }
  }
  return bitsShifted
}

lineReader.on('close', function () {
  parsePackets(transmission)
  console.log(versionSum)
})
