var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

function createHash(floor, generators, chips) {
  const hashArray = [floor]

  hashArray.push(
    generators
      .reduce(function (acc, floorGenerators) {
        acc.push(
          Array.from(floorGenerators)
            .sort()
            .reduce(function (acc2, generator) {
              acc2.push(generator)
              return acc2
            }, [])
            .join(',')
        )
        return acc
      }, [])
      .join('-')
  )

  hashArray.push(
    chips
      .reduce(function (acc, floorChips) {
        acc.push(
          Array.from(floorChips)
            .sort()
            .reduce(function (acc2, chip) {
              acc2.push(chip)
              return acc2
            }, [])
            .join(',')
        )
        return acc
      }, [])
      .join('-')
  )

  return hashArray.join('|')
}

const gens = [new Set(), new Set(), new Set(), new Set()]
const chips = [new Set(), new Set(), new Set(), new Set()]
var currentFloor = 0

const graph = new Map()

function rowIsValid(genRow, chipRow) {
  if (genRow.size === 0 || chipRow.size === 0) {
    return true
  }
  if (genRow.size) {
    var chipArray = Array.from(chipRow)
    for (var i = 0; i < chipArray.length; i++) {
      if (!genRow.has(chipArray[i])) {
        return false
      }
    }
  }
  return true
}

function getPossibleMoves(hash) {
  // eslint-disable-line
  const node = graph.get(hash)
  const floor = node.floor
  const generators = node.gens
  const chips = node.chips
  const distance = node.distance
  var moves = new Set()
  var floorGensArray = Array.from(generators[floor])
  var floorChipsArray = Array.from(chips[floor])
  var newHash

  const floorsVariants = []
  if (floor > 0) {
    floorsVariants.push(floor - 1)
  }
  if (floor < 3) {
    floorsVariants.push(floor + 1)
  }
  var gensClone = cloneFloorData(generators)
  var chipsClone = cloneFloorData(chips)

  for (var f = 0; f < floorsVariants.length; f++) {
    var nextFloor = floorsVariants[f]

    // gens
    for (var i = 0; i < floorGensArray.length; i++) {
      // chip-gen group
      if (chipsClone[floor].has(floorGensArray[i])) {
        gensClone[floor].delete(floorGensArray[i])
        chipsClone[floor].delete(floorGensArray[i])
        gensClone[nextFloor].add(floorGensArray[i])
        chipsClone[nextFloor].add(floorGensArray[i])

        if (
          rowIsValid(gensClone[floor], chipsClone[floor]) &&
          rowIsValid(gensClone[nextFloor], chipsClone[nextFloor])
        ) {
          newHash = createHash(nextFloor, gensClone, chipsClone)

          if (!graph.has(newHash)) {
            graph.set(newHash, {
              gens: cloneFloorData(gensClone),
              chips: cloneFloorData(chipsClone),
              floor: nextFloor,
              visited: false,
              distance: distance + 1,
              from: hash
            })
            moves.add(newHash)
          }
        }
        gensClone[floor].add(floorGensArray[i])
        chipsClone[floor].add(floorGensArray[i])
        gensClone[nextFloor].delete(floorGensArray[i])
        chipsClone[nextFloor].delete(floorGensArray[i])
      }

      // Single gen
      gensClone[floor].delete(floorGensArray[i])
      gensClone[nextFloor].add(floorGensArray[i])

      if (
        rowIsValid(gensClone[floor], chipsClone[floor]) &&
        rowIsValid(gensClone[nextFloor], chipsClone[nextFloor])
      ) {
        newHash = createHash(nextFloor, gensClone, chipsClone)

        if (!graph.has(newHash)) {
          graph.set(newHash, {
            gens: cloneFloorData(gensClone),
            chips: cloneFloorData(chipsClone),
            floor: nextFloor,
            visited: false,
            distance: distance + 1,
            from: hash
          })
          moves.add(newHash)
        }
      }
      gensClone[floor].add(floorGensArray[i])
      gensClone[nextFloor].delete(floorGensArray[i])

      // double gens
      for (var j = 0; j < floorGensArray.length; j++) {
        if (j !== i) {
          gensClone[floor].delete(floorGensArray[i])
          gensClone[floor].delete(floorGensArray[j])
          gensClone[nextFloor].add(floorGensArray[i])
          gensClone[nextFloor].add(floorGensArray[j])

          if (
            rowIsValid(gensClone[floor], chipsClone[floor]) &&
            rowIsValid(gensClone[nextFloor], chipsClone[nextFloor])
          ) {
            newHash = createHash(nextFloor, gensClone, chipsClone)

            if (!graph.has(newHash)) {
              graph.set(newHash, {
                gens: cloneFloorData(gensClone),
                chips: cloneFloorData(chipsClone),
                floor: nextFloor,
                visited: false,
                distance: distance + 1,
                from: hash
              })
              moves.add(newHash)
            }
          }
          gensClone[floor].add(floorGensArray[i])
          gensClone[floor].add(floorGensArray[j])
          gensClone[nextFloor].delete(floorGensArray[i])
          gensClone[nextFloor].delete(floorGensArray[j])
        }
      }
    }

    // chips
    for (var k = 0; k < floorChipsArray.length; k++) {
      // Single chip
      chipsClone[floor].delete(floorChipsArray[k])
      chipsClone[nextFloor].add(floorChipsArray[k])

      if (
        rowIsValid(gensClone[floor], chipsClone[floor]) &&
        rowIsValid(gensClone[nextFloor], chipsClone[nextFloor])
      ) {
        newHash = createHash(nextFloor, gensClone, chipsClone)

        if (!graph.has(newHash)) {
          graph.set(newHash, {
            gens: cloneFloorData(gensClone),
            chips: cloneFloorData(chipsClone),
            floor: nextFloor,
            visited: false,
            distance: distance + 1,
            from: hash
          })
          moves.add(newHash)
        }
      }
      chipsClone[floor].add(floorChipsArray[k])
      chipsClone[nextFloor].delete(floorChipsArray[k])

      // Double chips
      for (var l = 0; l < floorChipsArray.length; l++) {
        if (l !== k) {
          chipsClone[floor].delete(floorChipsArray[k])
          chipsClone[floor].delete(floorChipsArray[l])
          chipsClone[nextFloor].add(floorChipsArray[k])
          chipsClone[nextFloor].add(floorChipsArray[l])

          if (
            rowIsValid(gensClone[floor], chipsClone[floor]) &&
            rowIsValid(gensClone[nextFloor], chipsClone[nextFloor])
          ) {
            newHash = createHash(nextFloor, gensClone, chipsClone)

            if (!graph.has(newHash)) {
              graph.set(newHash, {
                gens: cloneFloorData(gensClone),
                chips: cloneFloorData(chipsClone),
                floor: nextFloor,
                visited: false,
                distance: distance + 1,
                from: hash
              })
              moves.add(newHash)
            }
          }
          chipsClone[floor].add(floorChipsArray[k])
          chipsClone[floor].add(floorChipsArray[l])
          chipsClone[nextFloor].delete(floorChipsArray[k])
          chipsClone[nextFloor].delete(floorChipsArray[l])
        }
      }
    }
  }
  return Array.from(moves)
}

function cloneFloorData(data) {
  var arr = []
  for (var i = 0; i < data.length; i++) {
    arr.push(new Set(Array.from(data[i])))
  }
  return arr
}

function logState(state) {
  for (var i = 3; i >= 0; i--) {
    console.log(
      `F${i + 1}  ${state.floor === i ? 'E' : '.'}  ${
        state.gens[i].has('hydrogen') ? 'HG' : '. '
      }  ${state.chips[i].has('hydrogen') ? 'HM' : '. '}  ${
        state.gens[i].has('lithium') ? 'LG' : '. '
      }  ${state.chips[i].has('lithium') ? 'LM' : '. '}  `
    )
  }
  console.log(' ')
}

var typesLenght = 0

lineReader.on('line', function (line) {
  var match
  var regexp = /([^-\s]+)(?:-compatible)? (generator|microchip)/g
  while ((match = regexp.exec(line))) {
    // eslint-disable-line
    if (match[2] === 'generator') {
      gens[currentFloor].add(match[1])
      typesLenght++
    } else {
      chips[currentFloor].add(match[1])
    }
  }
  currentFloor++
})

lineReader.on('close', function () {
  currentFloor = 0
  var startHash = createHash(currentFloor, gens, chips)
  graph.set(startHash, {
    gens: cloneFloorData(gens),
    chips: cloneFloorData(chips),
    floor: 0,
    visited: false,
    distance: 0
  })

  var done = false

  var timer = Date.now()
  var toExplore = [startHash]
  var currentNode

  // BFS
  while (toExplore.length && !done) {
    var hash = toExplore.shift()
    // console.log(graph.size, toExplore.length, hash);
    currentNode = graph.get(hash)
    // console.log(createHash(currentNode.floor, currentNode.gens, currentNode.chips));
    // logState(currentNode);
    if (!currentNode.visited) {
      currentNode.visited = true
      if (currentNode.gens[3].size === typesLenght && currentNode.chips[3].size === typesLenght) {
        done = true
      } else {
        var nextMoves = getPossibleMoves(hash)
        for (var i = 0; i < nextMoves.length; i++) {
          toExplore.push(nextMoves[i])
        }
      }
    }
  }

  if (done) {
    console.log(`${currentNode.distance} steps — ${Date.now() - timer}ms`)
  } else {
    console.log('Solution not found')
  }
})
