var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const wires = new Map()
const gates = new Map()

let gatesStarted = false

lineReader.on('line', function (line) {
  if (!line) {
    gatesStarted = true
    return
  }
  if (gatesStarted) {
    const [_, wire1, gate, wire2, wireO] = /^(\S{3}) (X?OR|AND) (\S{3}) -> (\S{3})/.exec(line)
    gates.set(wireO, {
      wire1,
      wire2,
      gate
    })
  } else {
    const [_, wire, value] = /^(\S{3}): (1|0)/.exec(line)
    wires.set(wire, Number(value))
  }
})

function getWire(wire) {
  if (wires.has(wire)) {
    return wires.get(wire)
  } else {
    const gate = gates.get(wire)
    const wire1 = getWire(gate.wire1)
    wires.set(gate.wire1, wire1)
    const wire2 = getWire(gate.wire2)
    wires.set(gate.wire2, wire2)
    if (gate.gate === 'AND') {
      return wire1 & wire2
    } else if (gate.gate === 'OR') {
      return wire1 | wire2
    } else {
      return wire1 ^ wire2
    }
  }
}

lineReader.on('close', function () {
  const x = Array.from(wires.keys())
    .filter(key => key[0] === 'x')
    .sort()
    .reverse()
    .map(getWire)
    .join('')
  console.log(x)
  const y = Array.from(wires.keys())
    .filter(key => key[0] === 'y')
    .sort()
    .reverse()
    .map(getWire)
    .join('')
  console.log(y)

  console.log((parseInt(x, 2) + parseInt(y, 2)).toString(2))

  console.log(
    Array.from(gates.keys())
      .filter(key => key[0] === 'z')
      .sort()
      .reverse()
      .map(getWire)
      .join('')
  )
})
