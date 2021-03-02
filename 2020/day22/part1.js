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

lineReader.on('close', function () {
  while (player1.length && player2.length) {
    let player1hand = player1.shift()
    let player2hand = player2.shift()
    if (player1hand > player2hand) {
      player1.push(player1hand)
      player1.push(player2hand)
    } else {
      player2.push(player2hand)
      player2.push(player1hand)
    }
  }
  console.log(
    (player1.length ? player1 : player2).reverse().reduce((acc, value, index) => {
      return (acc += value * (index + 1))
    }, 0)
  )
})
