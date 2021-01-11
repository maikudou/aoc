var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let nums

lineReader.on('line', function (line) {
  nums = line.split(',').map(num => parseInt(num, 10))
})

lineReader.on('close', function () {
  step = 1

  const log = new Map()
  let lastSpoken

  while (step <= 2020) {
    const lastSpokenBefore = lastSpoken
    if (nums.length) {
      lastSpoken = nums.shift()
      log.set(lastSpoken, [step])
    } else {
      let lastSpokenLog = log.get(lastSpoken) || []
      if (lastSpokenLog.length > 1) {
        lastSpoken = lastSpokenLog[1] - lastSpokenLog[0]
      } else {
        lastSpoken = 0
      }
      lastSpokenLog = log.get(lastSpoken) || []
      lastSpokenLog.push(step)
      if (lastSpokenLog.length > 2) {
        lastSpokenLog.shift()
      }
      log.set(lastSpoken, lastSpokenLog)
    }
    step++
  }

  console.log(lastSpoken)
})
