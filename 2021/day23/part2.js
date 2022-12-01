const { writeFileSync } = require('fs')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/test2')
})

const { Heap } = require('../../utils/Heap')

class MinHeap extends Heap {
  _compare(a, b) {
    return a.costTo < b.costTo
  }
}

const nodes = []
let index = 3
let id = 0

const topRowNum = 4

const targetXs = { A: 2, B: 4, C: 6, D: 8 }
const costs = { A: 1, B: 10, C: 100, D: 1000 }

function render(nodes) {
  let result = '#'.repeat(13)
  result += '\n#'
  const topRow = nodes.filter(node => node.y == topRowNum).sort((a, b) => a.x - b.x)
  for (let i = 0; i <= 10; i++) {
    result += topRow[0] && topRow[0].x == i ? topRow.shift().type : '.'
  }
  result += '#\n'
  for (let i = topRowNum - 1; i >= 0; i--) {
    if (i == topRowNum - 1) {
      result += '###'
    } else {
      result += '  #'
    }
    const middleRow = nodes.filter(node => node.y == i).sort((a, b) => a.x - b.x)
    for (let i = 2; i <= 8; i++) {
      result += i % 2 ? '#' : middleRow[0] && middleRow[0].x == i ? middleRow.shift().type : '.'
    }
    if (i == topRowNum - 1) {
      result += '###\n'
    } else {
      result += '#\n'
    }
  }
  result += '  #########\n'
  return result
}

function isInPlace(node, nodes) {
  if (!node) {
    return false
  }
  if (node.x !== targetXs[node.type]) {
    return false
  }
  if (node.y == 0) {
    return true
  }
  return isInPlace(
    nodes.find(f => f.x == targetXs[node.type] && f.y == node.y - 1),
    nodes
  )
}
function canMove(node, nodes) {
  if (isInPlace(node, nodes)) {
    return false
  }
  return !nodes.find(f => f.y > node.y && f.x == node.x)
}

function freeTarget(node, nodes) {
  const targetX = targetXs[node.type]
  const xNodes = nodes.filter(f => f.x == targetX).sort((a, b) => a.y - b.y)
  if (xNodes.length == 0) {
    return 0
  }
  if (xNodes.length == 1 && isInPlace(xNodes[0], xNodes)) {
    return 1
  }
  if (xNodes.length == 2 && isInPlace(xNodes[1], xNodes)) {
    return 2
  }
  if (xNodes.length == 3 && isInPlace(xNodes[2], xNodes)) {
    return 3
  }
  return -1
}

function hash(nodes) {
  return nodes
    .sort((a, b) => a.id - b.id)
    .map(a => `${a.x},${a.y}`)
    .join('|')
}

function isFinish(nodes) {
  return nodes.every(node => isInPlace(node, nodes))
}

function distance(x, y, x1, y1) {
  return Math.abs(x - x1) + Math.abs(y - y1)
}

function getPossibleMoves(nodes) {
  // All top row nodes
  const topRow = nodes.filter(node => node.y === topRowNum)

  // All middle row nodes
  const middleRow = nodes.filter(node => node.y == 1)

  // All bottom row nodes
  const bottomRow = nodes.filter(node => node.y == 0)
  // All bottom row nodes, what might move
  // Then can move if:
  // It is not in it's place and there is no nodes above it

  const possibilites = []

  nodes
    .filter(node => canMove(node, nodes))
    .forEach(mr => {
      // We need to check all target positions a node can reach
      // It can either move to the top row if it's not blocked
      // or can move to it's target column
      const topRowLower = topRow.filter(tr => tr !== mr && tr.x < mr.x).sort((a, b) => a.x - b.x)
      const topRowHigher = topRow.filter(tr => tr !== mr && tr.x > mr.x).sort((a, b) => a.x - b.x)

      let topRowLeftBarrier = topRowLower.length ? topRowLower.pop().x : -1
      let topRowRightBarrier = topRowHigher.length ? topRowHigher.shift().x : 11
      // Can move at all
      if (topRowLeftBarrier < mr.x && topRowRightBarrier > mr.x) {
        // Move to each free cell in top row
        for (let i = topRowLeftBarrier + 1; i < topRowRightBarrier; i++) {
          // Move to a cell if it not above a room and is not occupied
          if (
            (i % 2 || i < 2 || i > 8) &&
            !nodes.find(node => node.x == i && node.y == topRowNum)
          ) {
            const newState = nodes.filter(node => node != mr).map(node => ({ ...node }))
            newState.push({ ...mr, x: i, y: topRowNum })

            const cost = costs[mr.type] * distance(mr.x, mr.y, i, 2)
            possibilites.push({ state: newState, cost })
          }
        }
        // Can move to target x
        const targetX = targetXs[mr.type]
        if (topRowRightBarrier > targetX && topRowLeftBarrier < targetX) {
          const target = freeTarget(mr, nodes)
          if (target > -1) {
            const newState = nodes.filter(node => node != mr).map(node => ({ ...node }))
            newState.push({ ...mr, x: targetX, y: target })
            const dist = distance(mr.x, mr.y, targetX, topRowNum) + topRowNum - target
            const cost = costs[mr.type] * dist
            possibilites.push({ state: newState, cost })
          }
          // if (!bottomRow.find(br => br.x == targetX) && !middleRow.find(br => br.x == targetX)) {
          //   // Move to bottom row
          //   const newState = nodes.filter(node => node != mr).map(node => ({ ...node }))
          //   newState.push({ ...mr, x: targetX, y: 0 })
          //   const dist = distance(mr.x, mr.y, targetX, topRowNum) + topRowNum
          //   const cost = costs[mr.type] * dist
          //   possibilites.push({ state: newState, cost })
          // } else if (
          //   !middleRow.find(br => br.x == targetX) &&
          //   bottomRow.find(br => br !== mr && br.x == targetX && br.type == mr.type)
          // ) {
          //   // Move to middle row
          //   const newState = nodes.filter(node => node != mr).map(node => ({ ...node }))
          //   newState.push({ ...mr, x: targetX, y: 1 })
          //   const dist = distance(mr.x, mr.y, targetX, topRowNum) + 1
          //   const cost = costs[mr.type] * dist
          //   possibilites.push({ state: newState, cost })
          // }
        }
      }
    })
  return possibilites
}

function dijkstra(nodes) {
  const distances = new Map()

  let current = {
    hash: hash(nodes),
    nodes,
    costTo: 0
  }
  const visited = new Set()
  distances.set(current.hash, 0)

  let heap = new MinHeap()

  while (current) {
    if (visited.has(current.hash)) {
      current = heap.pop()
      continue
    }

    const moves = getPossibleMoves(current.nodes)
      .map(move => {
        const hashed = hash(move.state)
        const newMove = {
          hash: hashed,
          nodes: move.state,
          cost: move.cost,
          costTo: distances.has(hashed) ? distances.get(hashed) : Infinity
        }
        distances.set(newMove.hash, newMove.costTo)
        return newMove
      })
      .filter(move => !visited.has(move.hash))

    moves.forEach(move => {
      move.costTo = Math.min(move.costTo, current.costTo + move.cost)
      heap.insert(move)
    })

    visited.add(current.hash)
    if (isFinish(current.nodes)) {
      return current
    }
    current = heap.pop()
    distances.delete(current.hash)
  }
  return end
}

lineReader.on('line', function (line) {
  if (/\#(\w|\.)\#(\w|\.)\#(\w|\.)\#(\w|\.)\#/.test(line)) {
    const [_, x1, x2, x3, x4] = /\#(\w|\.)\#(\w|\.)\#(\w|\.)\#(\w|\.)\#/.exec(line)
    x1 !== '.' && nodes.push({ type: x1, x: 2, y: index, id: id++ })
    x2 !== '.' && nodes.push({ type: x2, x: 4, y: index, id: id++ })
    x3 !== '.' && nodes.push({ type: x3, x: 6, y: index, id: id++ })
    x4 !== '.' && nodes.push({ type: x4, x: 8, y: index, id: id++ })
    index--
  } else if (/\w/.test(line)) {
    const regexp = /\w/gi
    let result = regexp.exec(line)
    while (result) {
      nodes.push({ type: result[0], x: result.index - 1, y: 4, id: id++ })
      result = regexp.exec(line)
    }
  }
})

lineReader.on('close', function () {
  const time = Date.now()
  console.log(render(nodes))
  // getPossibleMoves(nodes).forEach(move => console.log(render(move.state)))
  // console.log(isFinish(nodes))
  const solution = dijkstra(nodes)
  console.log(solution.costTo)
  console.log(`${Date.now() - time}ms`)
})
