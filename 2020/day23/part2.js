var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let current
let subCurrent
let map = new Map()

lineReader.on('line', function (line) {
  line.split('').forEach(cup => {
    const currentCup = {
      id: parseInt(cup, 10),
      next: null
    }
    map.set(currentCup.id, currentCup)
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
  let id = 10
  let currentCup
  while (id <= 1000000) {
    currentCup = {
      id: id++,
      next: null
    }
    map.set(currentCup.id, currentCup)
    subCurrent.next = currentCup
    subCurrent = currentCup
  }
  subCurrent.next = current
  let excludes
  let excludesArray
  let nextExclude
  let destination

  for (var i = 0; i < 10000000; i++) {
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
      destinationId = 1000000
      while (excludes.has(destinationId) || current.id == destinationId) {
        destinationId--
      }
    }
    destination = map.get(destinationId)

    const destinationNext = destination.next
    destination.next = excludesArray[0]
    current.next = excludesArray[2].next
    excludesArray[2].next = destinationNext

    current = current.next
  }

  current = map.get(1)
  console.log(current.next.id * current.next.next.id)
})
