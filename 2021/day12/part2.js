var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = new Map()

lineReader.on('line', function (line) {
  const [left, right] = line.split('-')
  leftNode = map.get(left) || { id: left, big: /^[A-Z]+$/.test(left), connections: new Set() }
  rightNode = map.get(right) || { id: right, big: /^[A-Z]+$/.test(right), connections: new Set() }
  leftNode.connections.add(right)
  rightNode.connections.add(left)
  map.set(left, leftNode)
  map.set(right, rightNode)
})

function onlySmallFilter(connection) {
  if (connection === 'start' || connection === 'end') {
    return false
  }
  const nextNode = map.get(connection)
  return !nextNode.big
}

lineReader.on('close', function () {
  let paths = [{ path: [], nextStep: 'start', twice: null }]

  let ends = 0

  while (paths.length) {
    paths = paths.reduce((acc, value) => {
      let { path, nextStep, twice } = value
      // console.log(nextStep)
      const node = map.get(nextStep)
      path = path.slice(path)
      path.push(nextStep)

      if (nextStep === 'end') {
        ends++
        return acc
      }

      const connections = Array.from(node.connections)

      const possibleNextSteps = connections.filter(connection => {
        const nextNode = map.get(connection)
        return nextNode.big || path.indexOf(connection) == -1
      })

      // console.log('possibleNextSteps', possibleNextSteps)

      acc = acc.concat(possibleNextSteps.map(step => ({ path, nextStep: step, twice })))

      if (!twice) {
        const twicers = connections
          .filter(onlySmallFilter)
          .filter(connection => possibleNextSteps.indexOf(connection) == -1)
          .map(step => ({ path, nextStep: step, twice: step }))
        // console.log(twicers)
        acc = acc.concat(twicers)
      }

      return acc
    }, [])
    // console.log(paths)
  }

  console.log(ends)
})
