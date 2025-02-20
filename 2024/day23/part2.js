var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const connections = new Map()

lineReader.on('line', function (line) {
  const [c0, c1] = line.split('-')
  connections.set(c0, {
    arr: (connections.get(c0)?.arr || []).concat(c1),
    set: new Set((connections.get(c0)?.arr || []).concat(c1))
  })
  connections.set(c1, {
    arr: (connections.get(c1)?.arr || []).concat(c0),
    set: new Set((connections.get(c1)?.arr || []).concat(c0))
  })
})

lineReader.on('close', function () {
  const groups = new Set()

  Array.from(connections.entries()).forEach(([computer, connectedTo]) => {
    const group = new Set([computer])

    let toCheck = connectedTo.arr

    while (toCheck.length) {
      const nextCheck = toCheck.shift()
      if (group.has(nextCheck)) {
        continue
      }
      const nextConnected = connections.get(nextCheck)
      if (Array.from(group.values()).every(c => nextConnected.set.has(c))) {
        group.add(nextCheck)
        toCheck = toCheck.concat(nextConnected.arr.filter(c => !group.has(c)))
      }
    }

    groups.add(Array.from(group).sort().join(','))
  })

  console.log(Array.from(groups.values()).sort((a, b) => b.length - a.length)[0])
})
