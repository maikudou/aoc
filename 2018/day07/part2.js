var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const { Heap } = require('../../utils/Heap')
class AgentsHeap extends Heap {
  _compare(a, b) {
    return a.endTime < b.endTime
  }
}

const heap = new AgentsHeap()
const bumpTime = 60
const workersCount = 5

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
      parents: new Set(),
      timeToProcess: parent.charCodeAt() - 64 + bumpTime
    })
  }
  if (!graph.has(child)) {
    graph.set(child, {
      id: child,
      children: new Set(),
      parents: new Set(),
      timeToProcess: child.charCodeAt() - 64 + bumpTime
    })
  }
  graph.get(parent).children.add(child)
  graph.get(child).parents.add(parent)
})

lineReader.on('close', function () {
  // console.log(graph)
  const startNode = getStart()
  startNode.startTime = 0
  var queue = [startNode.id]
  var nextId

  var childrenIterator

  for (var i = 0; i < workersCount; i++) {
    heap.insert({
      id: null,
      endTime: 0
    })
  }

  var maxTime = 0

  while (queue.length) {
    nextId = queue.shift()
    var nextNode = graph.get(nextId)
    var top = heap.getTop()

    top.id = nextId
    top.endTime = nextNode.timeToProcess + Math.max(top.endTime, nextNode.startTime)

    maxTime = Math.max(maxTime, top.endTime)

    heap._bubbleDown(0)

    // console.log(heap);

    nextNode.completed = true
    childrenIterator = nextNode.children.values()
    child = childrenIterator.next().value
    while (child) {
      var parentComplete = true
      parentsInterator = graph.get(child).parents.values()
      parent = parentsInterator.next().value
      graph.get(child).startTime = nextNode.startTime + nextNode.timeToProcess

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
  console.log(maxTime)
})
