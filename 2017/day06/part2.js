var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var config
var configs = {}
var max
var maxIndex
var cycle = 0
var loop = null
var buggyConfig

lineReader.on('line', function (line) {
  config = line.split(/\s+/).map(Number)
})

lineReader.on('close', function () {
  while (!configs[config.join('|')] || buggyConfig) {
    configs[config.join('|')] = true

    max = 0
    maxIndex = null
    for (var i = 0; i < config.length; i++) {
      if (config[i] >= max) {
        if (config[i] != max) {
          maxIndex = i
        }
        max = config[i]
      }
    }
    config[maxIndex] = 0

    while (max) {
      max--
      maxIndex++
      if (maxIndex == config.length) {
        maxIndex = 0
      }
      config[maxIndex]++
    }
    cycle++

    if (config.join('|') == buggyConfig) {
      break
    }

    if (configs[config.join('|')] && !buggyConfig) {
      buggyConfig = config.join('|')
      cycle = 0
    }
  }
  console.log(cycle)
})
