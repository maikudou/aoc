var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let map = []
const originalMap = []
let units = []
const originalUnits = []
let y = 0

const debug = false

lineReader.on('line', function (line) {
  originalMap.push(
    line.split('').map((char, index) => {
      if (char === 'G' || char === 'E') {
        const unit = {
          type: char,
          x: index,
          y,
          hp: 200,
          attack: 3
        }
        originalUnits.push(unit)
        return unit
      }
      return char
    })
  )
  y++
})

function prepareUnits(units) {
  return units
    .filter(unit => unit.hp > 0)
    .sort(readingOrder)
    .map(unit => {
      unit.played = false
      return unit
    })
}

function readingOrder(a, b) {
  return a.y == b.y ? a.x - b.x : a.y - b.y
}

function fillDistances(map, x, y) {
  const distCandidates = [{ x, y }]
  map[y][x] = 0
  let currentCoordinate
  let currentCell
  while (distCandidates.length) {
    currentCoordinate = distCandidates.shift()
    const { x, y } = currentCoordinate
    currentCell = map[currentCoordinate.y][currentCoordinate.x]
    if (y > 0 && map[y - 1][x] == '.') {
      map[y - 1][x] = currentCell + 1
      distCandidates.push({ y: y - 1, x })
    }
    if (y < map.length - 1 && map[y + 1][x] == '.') {
      map[y + 1][x] = currentCell + 1
      distCandidates.push({ y: y + 1, x })
    }
    if (x > 0 && map[y][x - 1] == '.') {
      map[y][x - 1] = currentCell + 1
      distCandidates.push({ y, x: x - 1 })
    }
    if (x < map[0].length - 1 && map[y][x + 1] == '.') {
      map[y][x + 1] = currentCell + 1
      distCandidates.push({ y, x: x + 1 })
    }
  }
  return map
}

function printMap(map) {
  debug &&
    console.log(map.map(row => row.map(cell => (cell.type ? cell.type : cell)).join('')).join('\n'))
}

function copyMap(map) {
  return map.slice(0).map(row => row.slice(0))
}

function enemyType(unit) {
  return unit.type == 'G' ? 'E' : 'G'
}

function findVictims(map, unit) {
  const victims = []
  const { x, y } = unit
  if (y > 0 && map[y - 1][x].type == enemyType(unit)) {
    victims.push(map[y - 1][x])
  }
  if (y < map.length - 1 && map[y + 1][x].type == enemyType(unit)) {
    victims.push(map[y + 1][x])
  }
  if (x > 0 && map[y][x - 1].type == enemyType(unit)) {
    victims.push(map[y][x - 1])
  }
  if (x < map[0].length - 1 && map[y][x + 1].type == enemyType(unit)) {
    victims.push(map[y][x + 1])
  }
  return victims.sort((a, b) => {
    return a.hp === b.hp ? readingOrder(a, b) : a.hp - b.hp
  })
}

lineReader.on('close', function () {
  let found = false
  let attack = 3
  while (!found) {
    map = copyMap(originalMap)
    units = originalUnits.map(unit => ({ ...unit, attack: unit.type === 'E' ? attack : 3 }))
    units.forEach(unit => {
      map[unit.y][unit.x] = unit
      return unit
    })

    let round = 0
    let run = true
    let roundCompleted = false
    let elfDead = false
    while (run) {
      debug && console.log('\nRound', round + 1)
      debug && console.log('State before')
      printMap(map)
      units = prepareUnits(units)
      debug && console.log(units)
      roundCompleted = false
      units.forEach((unit, index) => {
        debug && console.log('\nUnit', unit)

        if (unit.hp <= 0 || !run) {
          debug && console.log('\t- skipped: dead')
          return
        }

        const enemies = units.filter(u => u.type !== unit.type && u.hp > 0).sort(readingOrder)

        if (!enemies.length) {
          debug && console.log('\t- skipped: no enemies')
          return
        }

        const victim = findVictims(map, unit)[0]
        if (victim) {
          debug && console.log('\tHas victim', victim)
          victim.hp -= unit.attack
          if (victim.hp <= 0) {
            map[victim.y][victim.x] = '.'
            if (victim.type == 'E') {
              elfDead = true
            }
          }
        } else if (enemies.length) {
          const targetCells = enemies.reduce((acc, enemy) => {
            const { x, y } = enemy
            if (y > 0 && map[y - 1][x] == '.') {
              acc.push({ y: y - 1, x })
            }
            if (y < map.length - 1 && map[y + 1][x] == '.') {
              acc.push({ y: y + 1, x })
            }
            if (x > 0 && map[y][x - 1] == '.') {
              acc.push({ y, x: x - 1 })
            }
            if (x < map[0].length - 1 && map[y][x + 1] == '.') {
              acc.push({ y, x: x + 1 })
            }
            return acc
          }, [])

          if (targetCells.length) {
            debug && console.log('\tHas targetCells', targetCells.length)

            const unitDistMap = fillDistances(copyMap(map), unit.x, unit.y)
            const nextTargetCell = targetCells
              .filter(cell => !isNaN(unitDistMap[cell.y][cell.x]))
              .map(cell => ({ ...cell, dist: unitDistMap[cell.y][cell.x] }))
              .sort((a, b) => (a.dist === b.dist ? readingOrder(a, b) : a.dist - b.dist))[0]

            if (nextTargetCell) {
              debug && console.log('\tNextTargetCell', nextTargetCell)

              const targetDistMap = fillDistances(copyMap(map), nextTargetCell.x, nextTargetCell.y)
              const possibleSteps = []
              if (unit.y > 0 && map[unit.y - 1][unit.x] == '.') {
                possibleSteps.push({ y: unit.y - 1, x: unit.x })
              }
              if (unit.y < map.length - 1 && map[unit.y + 1][unit.x] == '.') {
                possibleSteps.push({ y: unit.y + 1, x: unit.x })
              }
              if (unit.x > 0 && map[unit.y][unit.x - 1] == '.') {
                possibleSteps.push({ y: unit.y, x: unit.x - 1 })
              }
              if (unit.x < map[0].length - 1 && map[unit.y][unit.x + 1] == '.') {
                possibleSteps.push({ y: unit.y, x: unit.x + 1 })
              }

              const nextStep = possibleSteps
                .filter(step => !isNaN(targetDistMap[step.y][step.x]))
                .map(step => ({ ...step, dist: targetDistMap[step.y][step.x] }))
                .sort((a, b) => (a.dist === b.dist ? readingOrder(a, b) : a.dist - b.dist))[0]

              debug && console.log('\tMoving to', nextStep)
              const { x, y } = unit
              map[y][x] = '.'
              unit.x = nextStep.x
              unit.y = nextStep.y
              map[nextStep.y][nextStep.x] = unit
              const victimAfter = findVictims(map, unit)[0]
              if (victimAfter) {
                debug && console.log('\tHas new victim', victimAfter)
                victimAfter.hp -= unit.attack
                if (victimAfter.hp <= 0) {
                  map[victimAfter.y][victimAfter.x] = '.'
                  if (victimAfter.type == 'E') {
                    elfDead = true
                  }
                }
              }
            }
          } else {
            debug && console.log("\tCan't move yet")
          }
        }
        unit.played = true
      })

      const allUnitsPlayed = units
        .filter(unit => unit.hp > 0)
        .reduce((acc, unit) => (acc == false ? false : unit.played), true)

      if (allUnitsPlayed) {
        debug && console.log('Completed')
        round++
        debug && console.log('State after')
        printMap(map)
        debug && console.log(units.sort())
      } else {
        debug && console.log('Not completed')
        run = false
      }
    }

    units = prepareUnits(units)
    found = !elfDead
    found &&
      console.log(
        // round,
        // units.reduce((acc, unit) => acc + unit.hp, 0),
        round * units.reduce((acc, unit) => acc + unit.hp, 0)
        // elfDead,
        // attack
      )
    attack++
  }
})
