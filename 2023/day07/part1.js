var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const hands = []
const ranks = new Map([
  ['A', 0],
  ['K', 1],
  ['Q', 2],
  ['J', 3],
  ['T', 4],
  ['9', 5],
  ['8', 6],
  ['7', 7],
  ['6', 8],
  ['5', 9],
  ['4', 10],
  ['3', 11],
  ['2', 12]
])

lineReader.on('line', function (line) {
  const [_, hand, bid] = /(.{5}) (\d+)$/g.exec(line)
  hands.push({ hand, bid: parseInt(bid, 10) })
})

lineReader.on('close', function () {
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
  // build occurence map for each letter, sort by most repeated
  const occurenceMap = new Map()
  for (let i = 0; i < 5; i++) {
    const letter = hand.hand[i]
    occurenceMap.set(letter, occurenceMap.has(letter) ? occurenceMap.get(letter) + 1 : 1)
  }
  const sorted = Array.from(occurenceMap.entries()).sort((a, b) => b[1] - a[1])
  if (sorted[0][1] === 5) {
    return 0
  } else if (sorted[0][1] === 4) {
    return 1
  } else if (sorted[0][1] === 3) {
    if (sorted[1][1] === 2) {
      return 2
    } else {
      return 3
    }
  } else if (sorted[0][1] === 2) {
    if (sorted[1][1] === 2) {
      return 4
    } else {
      return 5
    }
  } else {
    return 6
  }
}
