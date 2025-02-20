var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const connections = new Map()

lineReader.on('line', function (line) {
  const [c0, c1] = line.split('-')
  connections.set(c0, (connections.get(c0) || []).concat(c1))
  connections.set(c1, (connections.get(c1) || []).concat(c0))
})

lineReader.on('close', function () {
  const threes = new Set()

  Array.from(connections.entries()).forEach(([computer, connectedTo]) => {
    connectedTo.forEach(connection => {
      connections
        .get(connection)
        .filter(connection => connection !== computer)
        .forEach(connection2 => {
          if (connections.get(connection2).includes(computer)) {
            const group = [computer, connection, connection2].sort()
            if (
              !threes.has(group) &&
              group.some(c => {
                return c[0] === 't'
              })
            ) {
              threes.add(group.join(','))
            }
          }
        })
    })
  })
  console.log(threes.size)
})
