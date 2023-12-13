var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const cards = []
let cardNum = 0
const cardNums = new Map()

lineReader.on('line', function (line) {
  const [_, id, w, p] = /Card\s+(\d+): ([\d\s]+)\|([\d\s]+)/g.exec(line)
  cardNums.set(parseInt(id, 10), 1)
  const winning = new Set(w.trim().replace(/\s+/g, ' ').split(' '))
  const playing = p.trim().replace(/\s+/g, ' ').split(' ')
  cards.push([
    parseInt(id, 10),
    playing.reduce((acc, num) => {
      if (winning.has(num)) {
        acc = acc + 1
      }
      return acc
    }, 0)
  ])
})

lineReader.on('close', function () {
  cardNum = cards.length
  let cardsWon
  for (let cardIndex = 1; cardIndex <= cardNum; cardIndex++) {
    cardsWon = cards[cardIndex - 1][1]
    for (let i = 0; i < cardsWon; i++) {
      cardNums.set(cardIndex + 1 + i, cardNums.get(cardIndex + 1 + i) + cardNums.get(cardIndex))
    }
  }
  console.log(Array.from(cardNums.values()).reduce((acc, value) => acc + value, 0))
})
