var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let current
let subCurrent

lineReader.on('line', function (line) {
  line.split('').forEach(cup => {
    const currentCup = {
      id: parseInt(cup, 10),
      next: null
    }
    if (!current) {
      current = currentCup
      subCurrent = current
    } else {
      subCurrent.next = currentCup
      subCurrent = currentCup
    }
  })
})

lineReader.on('close', function () {
  subCurrent.next = current
  let excludes
  let excludesArray
  let nextExclude
  let destination

  for (var i = 0; i < 100; i++) {
    excludes = new Set()
    excludesArray = []
    nextExclude = current.next
    for (var k = 0; k < 3; k++) {
      excludes.add(nextExclude.id)
      excludesArray.push(nextExclude)
      nextExclude = nextExclude.next
    }

    destination = nextExclude
    let destinationId = current.id - 1
    while (excludes.has(destinationId) && destinationId > 0) {
      destinationId--
    }
    if (destinationId == 0) {
      destinationId = 9
      while (excludes.has(destinationId) || current.id == destinationId) {
        destinationId--
      }
    }
    while (destination.id != destinationId) {
      destination = destination.next
    }

    const destinationNext = destination.next
    destination.next = excludesArray[0]
    current.next = excludesArray[2].next
    excludesArray[2].next = destinationNext

    current = current.next
  }

  while (current.id != 1) {
    current = current.next
  }
  current = current.next

  const startId = current.id
  const result = []
  while (current && current.id != 1) {
    result.push(current.id)
    current = current.next
    if (current.id == startId) {
      break
    }
  }

  console.log(result.join(''))
})
