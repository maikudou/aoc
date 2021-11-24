const manhattanDistance = require('../../utils/manhattanDistance')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const bots = []
let result = Infinity

lineReader.on('line', function (line) {
  const [_, x, y, z, r] = /pos=<(\-?\d+),(\-?\d+),(\-?\d+)>, r=(\d+)/.exec(line)
  bots.push({ x: parseInt(x, 10), y: parseInt(y, 10), z: parseInt(z, 10), r: parseInt(r, 10) })
})

lineReader.on('close', function () {
  bots.forEach(bot => {
    bot.intersectsWith = []
    bots.forEach(otherBot => {
      if (otherBot !== bot) {
        distance = manhattanDistance(bot, otherBot)
        if (bot.r + otherBot.r >= distance) {
          bot.intersectsWith.push(otherBot)
        }
      }
    })
  })
  const onlyTopBots = bots
    .sort((a, b) => b.intersectsWith.length - a.intersectsWith.length)
    .reduce((acc, value) => {
      value.intersectsWith = value.intersectsWith.sort((a, b) =>
        a.r == b.r ? b.intersectsWith.length - a.intersectsWith.length : a.r - b.r
      )
      if (acc.length) {
        if (value.intersectsWith.length == acc[0].intersectsWith.length) {
          acc.push(value)
        }
      } else {
        acc.push(value)
      }
      return acc
    }, [])
  const maximumBots = onlyTopBots[0].intersectsWith.length
  // console.log(onlyTopBots, maximumBots)
  const minimalTopBots = onlyTopBots
    .reduce((acc, bot) => {
      return acc.concat(
        bot.intersectsWith
          .filter(bot => bot.intersectsWith.length === maximumBots)
          .reduce((acc, value) => {
            if (acc.length) {
              if (
                value.r === acc[0].r &&
                value.intersectsWith.length == acc[0].intersectsWith.length
              ) {
                acc.push(value)
              }
            } else {
              acc.push(value)
            }
            return acc
          }, [])
      )
    }, [])
    .sort((a, b) => a.r - b.r)
    .reduce((acc, value) => {
      if (acc.length) {
        if (value.r === acc[0].r) {
          acc.push(value)
        }
      } else {
        acc.push(value)
      }
      return acc
    }, [])
    .reduce((acc, value) => {
      if (acc.indexOf(value) == -1) {
        acc.push(value)
      }
      return acc
    }, [])
  // console.log(minimalTopBots)
  minimalTopBots.forEach(bot => {
    const marginals = bot.intersectsWith.reduce(
      (acc, otherBot) => {
        let leftBot
        let rightBot
        if (bot.x < otherBot.x) {
          leftBot = bot
          rightBot = otherBot
        } else {
          rightBot = bot
          leftBot = otherBot
        }
        const minX = Math.max(rightBot.x - rightBot.r, leftBot.x - leftBot.r)
        const maxX = Math.min(leftBot.x + leftBot.r, rightBot.x + rightBot.r)
        acc.minX = Math.max(acc.minX, minX)
        acc.maxX = Math.min(acc.maxX, maxX)
        console.log(minX, maxX, acc)
        return acc
      },
      { minX: -Infinity, maxX: Infinity }
    )
    console.log(marginals)
    process.exit(1)
    for (var x = bot.x - bot.r; x <= bot.x + bot.r; x++) {
      for (var y = bot.y - bot.r; y <= bot.y + bot.r; y++) {
        for (var z = bot.z - bot.r; z <= bot.z + bot.r; z++) {
          const botsInRange = bot.intersectsWith.reduce((acc, bot) => {
            return acc + (bot.r >= manhattanDistance(bot, { x, y, z }) ? 1 : 0)
          }, 0)
          if (botsInRange + 1 == maximumBots) {
            const zeroDistance = manhattanDistance({ x: 0, y: 0, z: 0 }, { x, y, z })
            result = Math.min(result, zeroDistance)
          }
        }
      }
    }
  })
  console.log(result)
})
