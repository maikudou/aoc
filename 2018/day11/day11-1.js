const input = 3031;

function rackID(x) {
    return x + 10;
}

powerLevels = [[], []];
clusetPowerLevels = new Map();

function powerLevel(x, y, serialNumber) {
    if (powerLevels[x] && typeof powerLevels[x][y] != 'undefined') {
        return powerLevels[x][y];
    }
    var level = rackID(x);
    level = level * y;
    level += serialNumber;
    level = level * rackID(x);
    if (level < 100) {
        level = 0;
    } else {
        level = ((level - level % 100)/100) % 10;
    }
    level -= 5;

    if (!powerLevels[x]) {
        powerLevels[x] = [];
    }

    powerLevels[x][y] = level;
    return level;
}

function clusterPowerLevel(x, y, serialNumber, size) {
    var previousLevel = clusetPowerLevels.get(`${x},${y},${size-1}`) || 0;

    for (var i = 1; i < size; i++) {
        previousLevel += powerLevel(x+i-1, y+size-1, serialNumber);
        previousLevel += powerLevel(x+size-1, y+i-1, serialNumber);
    }

    previousLevel += powerLevel(x+size-1, y+size-1, serialNumber);
    clusetPowerLevels.set(`${x},${y},${size}`, previousLevel);
    return previousLevel;
}

var maxPower = -Infinity;
var top;

for (var i = 1; i <= 298; i++) {
    for (var j = 1; j <= 298; j++) {
        for (var size = 1; size + i <= 300 && size + j <= 300; size++) {
            var currentPower = clusterPowerLevel(i, j, input, size);
            if (currentPower > maxPower) {
                maxPower = currentPower;
                top = `${i},${j},${size}`;
            }
        }
    }
}

console.log(top);
