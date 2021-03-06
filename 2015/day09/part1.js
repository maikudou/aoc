var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var distances = {}

lineReader.on('line', function (line) {
  var split = line.split(' to ')
  var from = split[0]
  var split2 = split[1].split(' = ')
  var to = split2[0]
  var distance = parseInt(split2[1], 10)

  if (typeof distances[from] === 'undefined') {
    distances[from] = {}
  }
  if (typeof distances[to] === 'undefined') {
    distances[to] = {}
  }
  distances[from][to] = parseInt(distance, 10)
  distances[to][from] = parseInt(distance, 10)
})

var routes = {}

lineReader.on('close', function () {
  for (var starter in distances) {
    getNext([starter])
  }
  console.log(
    Object.keys(routes).reduce((acc, value) => {
      return Math.min(
        acc,
        routes[value].reduce(function (prev, next) {
          return prev + next
        }, 0)
      )
    }, Infinity)
  )
})

function getNext(toVisit) {
  if (typeof routes[toVisit[0]] === 'undefined') {
    routes[toVisit[0]] = []
  }
  var from = toVisit[toVisit.length - 1]
  var fromDists = distances[from]
  var shortestDistance = 1000
  var next = ''
  for (var dest in fromDists) {
    if (fromDists[dest] < shortestDistance && toVisit.indexOf(dest) === -1) {
      shortestDistance = fromDists[dest]
      next = dest
    }
  }
  routes[toVisit[0]].push(shortestDistance)
  if (toVisit.length < 7) {
    toVisit.push(next)
    getNext(toVisit)
  }
}
