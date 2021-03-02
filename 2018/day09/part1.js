var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var playerCount
var lastMarbleValue
var input

const playerScores = new Map()
var currentPlayer = 1

var current = {
  score: 0
}

var nextInsertAfter
var nextToRemove

var zero = current

current.next = current
current.prev = current

lineReader.on('line', function (line) {
  input = line
})

lineReader.on('close', function () {
  ;[_, playerCount, lastMarbleValue] = /(\d+) players; last marble is worth (\d+) points/.exec(
    input
  )
  for (var i = 1; i <= playerCount; i++) {
    playerScores.set(i, 0)
  }
  for (var j = 1; j <= lastMarbleValue; j++) {
    if (currentPlayer > playerCount) {
      currentPlayer = 1
    }

    if (j % 23) {
      var newMarble = {
        score: j,
        prev: current.next,
        next: current.next.next
      }

      current.next.next.prev = newMarble
      current.next.next = newMarble
      current = newMarble
    } else {
      playerScores.set(currentPlayer, playerScores.get(currentPlayer) + j)
      nextToRemove = current.prev.prev.prev.prev.prev.prev.prev

      playerScores.set(currentPlayer, playerScores.get(currentPlayer) + nextToRemove.score)
      current = nextToRemove.next
      nextToRemove.prev.next = current
      current.prev = nextToRemove.prev
    }

    currentPlayer++
  }
  console.log(Array.from(playerScores.values()).sort()[playerCount - 1])
})
