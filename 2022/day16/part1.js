const { Heap } = require('../../utils/Heap')

class MaxHeap extends Heap {
  _compare(a, b) {
    return (
      a.released + a.pressure * a.timeLeft + a.openValves.size >
      b.released + b.pressure * b.timeLeft + a.openValves.size
    )
  }
}

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const valves = new Map()

lineReader.on('line', function (line) {
  const [_, valve, rate, targets] =
    /^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)$/.exec(line)
  valves.set(valve, { id: valve, rate: parseInt(rate, 10), targets: targets.split(', ') })
})

const pressures = new Map()

function nodeId(node) {
  return `${node.valve}|${node.released}|${Array.from(node.openValves.keys()).sort().join('')}`
}

function getPressure(openValves) {
  return Array.from(openValves.keys()).reduce((acc, valve) => acc + valves.get(valve).rate, 0)
}

function dijkstra() {
  const visited = new Set()
  const openableValvesCount = Array.from(valves.values()).filter(v => v.rate > 0).length
  const heap = new MaxHeap()

  let max = 0

  let current = {
    valve: 'AA',
    timeLeft: 30,
    released: 0,
    pressure: 0,
    openValves: new Set(),
    from: 'AA'
  }

  while (current) {
    max = Math.max(max, current.pressure * current.timeLeft + current.released)
    if (
      current.timeLeft === 0 ||
      current.openValves.size === openableValvesCount ||
      visited.has(nodeId(current))
    ) {
      current = heap.pop()
      continue
    }
    visited.add(nodeId(current))

    const currentValve = valves.get(current.valve)

    // Check if it makes sense to open this valve
    if (currentValve.rate && !current.openValves.has(current.valve)) {
      heap.insert({
        valve: current.valve,
        timeLeft: current.timeLeft - 1,
        released: current.released + getPressure(current.openValves),
        pressure: current.pressure + currentValve.rate,
        openValves: new Set(Array.from(current.openValves.keys()).concat(current.valve)),
        from: current.valve
      })
    }

    // Add all possible movements from here
    currentValve.targets
      .filter(key => key !== current.from)
      .forEach(key => {
        heap.insert({
          valve: key,
          timeLeft: current.timeLeft - 1,
          released: current.released + current.pressure,
          pressure: current.pressure,
          openValves: new Set(Array.from(current.openValves.keys())),
          from: current.valve
        })
      })

    current = heap.pop()
  }
  return max
}

lineReader.on('close', function () {
  console.log(dijkstra())
})
