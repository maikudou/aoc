const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let seeds
let currentMap
let maps = []

lineReader.on('line', function (line) {
  if (line) {
    if (!seeds) {
      const [_, seedMatch] = /^seeds: ([\d\s]+)$/.exec(line)
      seeds = seedMatch.split(' ').map(toDecimal)
    } else if (!currentMap) {
      const [_, source, dest] = /(\w+)-to-(\w+) map:/.exec(line)
      currentMap = []
    } else {
      currentMap.push(line.split(' ').map(toDecimal))
    }
  } else {
    if (currentMap) {
      maps.push(currentMap)
    }
    currentMap = null
  }
})

lineReader.on('close', function () {
  let lowest = Infinity
  maps.push(currentMap)
  let source
  let destination
  let map
  for (let i = 0; i < seeds.length; i++) {
    source = seeds[i]
    for (let j = 0; j < maps.length; j++) {
      map = maps[j]
      const mapping = map.find(([_, start, range]) => start <= source && start + range >= source)
      destination = mapping ? mapping[0] + source - mapping[1] : source
      source = destination
    }
    lowest = Math.min(lowest, destination)
  }
  console.log(lowest)
})
