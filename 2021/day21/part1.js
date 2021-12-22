var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const players = []

lineReader.on('line', function (line) {
  const [_, position] = /position: (\d+)/.exec(line)
  players.push({
    pos: parseInt(position, 10) - 1,
    score: 0
  })
})

lineReader.on('close', function () {
  let die = 0
  let looser
  let stop = false
  while (!stop) {
    players.forEach(player => {
      if (stop) {
        return
      }
      let move = (die++ % 100) + 1 + (die++ % 100) + 1 + (die++ % 100) + 1
      player.pos = (move + player.pos) % 10
      player.score += player.pos + 1
      // console.log(player.pos)
      if (player.score >= 1000) {
        stop = true
      }
    })
    if (stop) {
      break
    }
  }
  console.log(die * (players[0].score >= 1000 ? players[1].score : players[0].score))
})
