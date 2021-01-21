var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

lineReader.on('line', function (line) {
  var [, name, sectorId, checksum] = /^([a-z-]+)-(\d+)\[(.+)\]$/.exec(line)
  const clearNameArray = name.replace(/[^a-z]/g, '').split('')
  var usage = new Map()
  for (var i = 0; i < clearNameArray.length; i++) {
    if (usage.has(clearNameArray[i])) {
      usage.set(clearNameArray[i], usage.get(clearNameArray[i]) + 1)
    } else {
      usage.set(clearNameArray[i], 1)
    }
  }

  usage = Array.from(usage)

  usage.sort(function (a, b) {
    if (a[1] > b[1]) {
      return -1
    } else if (a[1] < b[1]) {
      return 1
    } else if (a[0] > b[0]) {
      return 1
    } else if (a[0] < b[0]) {
      return -1
    } else {
      return 0
    }
  })

  sectorId = parseInt(sectorId, 10)

  var calculatedChecksum = usage
    .slice(0, 5)
    .map(value => value[0])
    .join('')
  if (calculatedChecksum === checksum) {
    for (var i = 0; i < sectorId; i++) {
      name = name
        .split('')
        .map(function (char) {
          var codepoint = char.codePointAt()
          if (char === '-' || char === ' ') {
            return ' '
          }
          return String.fromCodePoint(codepoint === 122 ? 97 : codepoint + 1)
        })
        .join('')
    }

    if (name === 'northpole object storage') {
      console.log(sectorId)
      process.exit()
    }
  }
})

lineReader.on('close', function () {})
