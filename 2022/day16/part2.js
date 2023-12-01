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
  input: require('fs').createReadStream(__dirname + '/test')
})

const valves = new Map()

lineReader.on('line', function (line) {
  const [_, valve, rate, targets] =
    /^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)$/.exec(line)
  valves.set(valve, { id: valve, rate: parseInt(rate, 10), targets: targets.split(', ') })
})

const pressures = new Map()

function nodeId(node) {
  return `${node.me.valve}|${node.elephant.valve}|${node.released}|${Array.from(
    node.openValves.keys()
  )
    .sort()
    .join('')}`
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
    timeLeft: 26,
    released: 0,
    pressure: 0,
    openValves: new Set(),
    me: {
      valve: 'AA',
      from: 'AA'
    },
    elephant: {
      valve: 'AA',
      from: 'AA'
    }
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

    const currentMeValve = valves.get(current.me.valve)
    const currentElephantValve = valves.get(current.elephant.valve)

    const possibleMeTargets = currentMeValve.targets.filter(key => key !== current.me.from)
    const possibleElephantTargets = currentElephantValve.targets.filter(
      key => key !== current.elephant.from
    )

    // Check if it makes sense to open this valve
    if (currentMeValve.rate && !current.openValves.has(current.valve)) {
      possibleElephantTargets.forEach(key => {
        heap.insert({
          timeLeft: current.timeLeft - 1,
          released: current.released + getPressure(current.openValves),
          pressure: current.pressure + currentMeValve.rate,
          openValves: new Set(Array.from(current.openValves.keys()).concat(currentMeValve.id)),
          me: {
            valve: currentMeValve.id,
            from: currentMeValve.id
          },
          elephant: {
            valve: key,
            from: currentElephantValve.id
          }
        })
      })
    }
    if (currentElephantValve.rate && !current.openValves.has(current.valve)) {
      possibleMeTargets.forEach(key => {
        heap.insert({
          timeLeft: current.timeLeft - 1,
          released: current.released + getPressure(current.openValves),
          pressure: current.pressure + currentElephantValve.rate,
          openValves: new Set(
            Array.from(current.openValves.keys()).concat(currentElephantValve.id)
          ),
          elephant: {
            valve: currentElephantValve.id,
            from: currentElephantValve.id
          },
          me: {
            valve: key,
            from: currentMeValve.id
          }
        })
      })
    }

    // Add all possible movements from here
    currentMeValve.targets
      .filter(key => key !== current.from)
      .forEach(meKey => {
        possibleElephantTargets.forEach(elephantKey => {
          heap.insert({
            timeLeft: current.timeLeft - 1,
            released: current.released + current.pressure,
            pressure: current.pressure,
            openValves: new Set(Array.from(current.openValves.keys())),
            me: {
              valve: meKey,
              from: currentMeValve.id
            },
            elephant: {
              valve: elephantKey,
              from: currentElephantValve.id
            }
          })
        })
      })

    current = heap.pop()
  }
  return max
}

lineReader.on('close', function () {
  console.log(dijkstra())
})
