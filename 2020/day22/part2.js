var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const player1 = []
const player2 = []
let currentPlayer = player1

lineReader.on('line', function (line) {
  if (line == 'Player 1:') {
    return
  } else if (line == 'Player 2:') {
    currentPlayer = player2
  } else if (line) {
    currentPlayer.push(parseInt(line, 10))
  }
})

const combatWon = (player1, player2) => {
  const states = new Set()
  while (player1.length && player2.length) {
    const state = player1.join(',') + '|' + player2.join(',')
    if (states.has(state)) {
      return true
    }
    states.add(state)
    let player1hand = player1.shift()
    let player2hand = player2.shift()
    let won = false
    if (player1.length >= player1hand && player2.length >= player2hand) {
      won = combatWon(player1.slice(0, player1hand), player2.slice(0, player2hand))
    } else {
      won = player1hand > player2hand
    }
    if (won) {
      player1.push(player1hand)
      player1.push(player2hand)
    } else {
      player2.push(player2hand)
      player2.push(player1hand)
    }
  }
  return player1.length > 0
}

lineReader.on('close', function () {
  combatWon(player1, player2)
  console.log(
    (player1.length ? player1 : player2).reverse().reduce((acc, value, index) => {
      return (acc += value * (index + 1))
    }, 0)
  )
})
