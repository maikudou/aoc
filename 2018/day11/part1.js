const input = 3031

function rackID(x) {
  return x + 10
}

powerLevels = [[], []]

function powerLevel(x, y, serialNumber) {
  if (powerLevels[x] && typeof powerLevels[x][y] != 'undefined') {
    return powerLevels[x][y]
  }
  var level = rackID(x)
  level = level * y
  level += serialNumber
  level = level * rackID(x)
  if (level < 100) {
    level = 0
  } else {
    level = ((level - (level % 100)) / 100) % 10
  }
  level -= 5

  if (!powerLevels[x]) {
    powerLevels[x] = []
  }

  powerLevels[x][y] = level
  return level
}

var maxPower = -Infinity
var top

for (var i = 1; i <= 298; i++) {
  for (var j = 1; j <= 298; j++) {
    var currentPower = 0
    for (var n = 0; n < 3; n++) {
      for (var m = 0; m < 3; m++) {
        currentPower += powerLevel(i + n, j + m, input)
      }
    }
    if (currentPower > maxPower) {
      maxPower = currentPower
      top = `${i},${j}`
    }
  }
}

console.log(top)
