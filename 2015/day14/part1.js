var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var regexp = /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\./

var contenders = []

lineReader.on('line', function (line) {
  var parse = regexp.exec(line)
  contenders.push({
    name: parse[1],
    speed: Number(parse[2]),
    fly: Number(parse[3]),
    rest: Number(parse[4]),
    state: 'running',
    flyingTime: 0,
    restingTime: 0,
    distance: 0
  })
})

lineReader.on('close', function () {
  for (var time = 0; time < 2503; time++) {
    for (var i = 0; i < contenders.length; i++) {
      var contender = contenders[i]
      if (contender.state === 'running') {
        contender.distance += contender.speed
        contender.flyingTime++
        if (contender.flyingTime === contender.fly) {
          contender.restingTime = 0
          contender.flyingTime = 0
          contender.state = 'resting'
        }
      } else {
        contender.restingTime++
        if (contender.restingTime === contender.rest) {
          contender.restingTime = 0
          contender.flyingTime = 0
          contender.state = 'running'
        }
      }
    }
  }

  console.log(
    contenders.reduce((acc, value) => {
      return Math.max(acc, value.distance)
    }, 0)
  )
})
