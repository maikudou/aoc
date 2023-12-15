var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const hands = []
const ranks = new Map([
  ['A', 0],
  ['K', 1],
  ['Q', 2],
  ['T', 3],
  ['9', 4],
  ['8', 5],
  ['7', 6],
  ['6', 7],
  ['5', 8],
  ['4', 9],
  ['3', 10],
  ['2', 11],
  ['J', 12]
])
const types = [
  '5 of a kind',
  '4 of a kind',
  'full house',
  'three of a kind',
  'two pairs',
  'pair',
  'upper hand'
]

lineReader.on('line', function (line) {
  const [_, hand, bid] = /(.{5}) (\d+)$/g.exec(line)
  hands.push({ hand, bid: parseInt(bid, 10) })
})

lineReader.on('close', function () {
  // hands.forEach(hand => {
  //   console.log(hand, types[getType(hand)])
  // })

  hands.sort((a, b) => {
    const typeA = getType(a)
    const typeB = getType(b)
    if (typeA === typeB) {
      for (let i = 0; i < 5; i++) {
        const powerA = ranks.get(a.hand[i])
        const powerB = ranks.get(b.hand[i])
        if (powerA < powerB) {
          return 1
        } else if (powerA > powerB) {
          return -1
        }
      }
      return 0
    } else {
      return typeB - typeA
    }
  })
  // console.log(hands)
  console.log(
    hands.reduce((acc, value, index) => {
      return acc + value.bid * (index + 1)
    }, 0)
  )
})

function getType(hand) {
  const occurenceMap = new Map()
  let jockersCount = 0
  for (let i = 0; i < 5; i++) {
    const letter = hand.hand[i]
    if (letter === 'J') {
      jockersCount++
    }
    occurenceMap.set(letter, occurenceMap.has(letter) ? occurenceMap.get(letter) + 1 : 1)
  }
  const sorted = Array.from(occurenceMap.entries()).sort((a, b) => {
    if (b[1] === a[1]) {
      return a[0] === 'J' ? -1 : b[0] === 'J' ? 1 : 0
    } else {
      return b[1] - a[1]
    }
  })
  if (sorted[0][0] === 'J') {
    if (sorted[0][1] === 5 || sorted[0][1] === 4) {
      return 0
    } else if (sorted[0][1] === 3) {
      if (sorted[1][1] === 2) {
        return 0
      } else {
        return 1
      }
    } else if (sorted[0][1] === 2) {
      if (sorted[1][1] === 2) {
        return 1
      } else {
        return 3
      }
    } else {
      return 5
    }
  } else {
    if (sorted[0][1] === 5 || sorted[0][1] + jockersCount === 5) {
      return 0
    } else if (sorted[0][1] === 4 || sorted[0][1] + jockersCount === 4) {
      return 1
    } else if (sorted[0][1] === 3 || sorted[0][1] + jockersCount === 3) {
      if (sorted[1][1] === 2) {
        return 2
      } else {
        return 3
      }
    } else if (sorted[0][1] === 2 || jockersCount === 1) {
      if (sorted[1][1] === 2) {
        return 4
      } else {
        return 5
      }
    } else {
      return 6
    }
  }
}
