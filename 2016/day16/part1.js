function getData(data, targetLength) {
  while (data.length < targetLength) {
    var length = data.length
    data.push('0')
    for (var i = length - 1; i >= 0; i--) {
      data.push(data[i] === '0' ? '1' : '0')
    }
  }
  return data.slice(0, targetLength)
}

function getChecksum(data) {
  var checksum = []
  while (!(checksum.length % 2) || checksum.length === 0) {
    checksum = []
    for (var i = 0; i < data.length - 1; i += 2) {
      if (data[i] === data[i + 1]) {
        checksum.push('1')
      } else {
        checksum.push('0')
      }
    }
    data = checksum
  }
  return checksum
}

console.log(getChecksum(getData('11011110011011101'.split(''), 272)).join(''))
