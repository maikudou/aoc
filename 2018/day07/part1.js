var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const graph = new Map()

function getStart() {
  const graphKeys = Array.from(graph.keys())
  var node = graph.get(graphKeys[Math.floor(Math.random() * graphKeys.length)])
  var queue = []

  var parentsInterator
  var parent

  while (node.parents.size) {
    parentsInterator = node.parents.values()
    parent = parentsInterator.next().value
    while (parent) {
      queue.push(graph.get(parent))
      parent = parentsInterator.next().value
    }
    node = queue.pop()
  }
  return node
}

lineReader.on('line', function (line) {
  var [_, parent, child] = /Step (.) must be finished before step (.) can begin\./.exec(line)
  if (!graph.has(parent)) {
    graph.set(parent, {
      id: parent,
      children: new Set(),
      parents: new Set()
    })
  }
  if (!graph.has(child)) {
    graph.set(child, {
      id: child,
      children: new Set(),
      parents: new Set()
    })
  }
  graph.get(parent).children.add(child)
  graph.get(child).parents.add(parent)
})

lineReader.on('close', function () {
  const startNode = getStart()
  var queue = [startNode.id]
  var nextId

  var childrenIterator
  var order = ''

  while (queue.length) {
    nextId = queue.sort().shift()
    order += nextId
    var nextNode = graph.get(nextId)
    nextNode.completed = true
    childrenIterator = nextNode.children.values()
    child = childrenIterator.next().value
    while (child) {
      var parentComplete = true
      parentsInterator = graph.get(child).parents.values()
      parent = parentsInterator.next().value
      while (parent) {
        if (!graph.get(parent).completed) {
          parentComplete = false
          break
        }
        parent = parentsInterator.next().value
      }

      if (parentComplete) {
        queue.push(child)
      }

      child = childrenIterator.next().value
    }
  }

  console.log(order)
})
