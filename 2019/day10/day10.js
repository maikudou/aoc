/* eslint-disable complexity */
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

const map = [];

lineReader.on('line', function(line) {
    map.push(line.split('').map(value => value === '#' ? 1 : 0));
});

function clone(arr) {
    const newArr = [];
    arr.map(subArr => newArr.push(subArr.slice(0)));
    return newArr;
}

const counts = new Map();
function addCount(x, y) {
    if (!counts.has(`${x}|${y}`)) {
        counts.set(`${x}|${y}`, 0);
    }
    counts.set(`${x}|${y}`, counts.get(`${x}|${y}`) + 1);
}

function invalidate(x, y, xDiff, yDiff, map, column, row) {
    const height = map.length;
    const width = map[0].length;
    var hit = false;
    var sub = 3;
    if (map[y][x] === 1) {
        hit = true;
        addCount(column, row);
        map[y][x] = 2;
    }

    var fx = x + xDiff;
    var fy = y + yDiff;

    while (fx >= 0 && fx < width && fy >= 0 && fy < height) {
        if (map[fy][fx] === 1) {
            if (hit) {
                map[fy][fx] = sub;
                sub++;
            } else {
                hit = true;
                addCount(column, row);
                map[fy][fx] = 2;
            }
        }
        fx += xDiff;
        fy += yDiff;
    }
}

lineReader.on('close', function() {
    const height = map.length;
    const width = map[0].length;
    for (var row = 0; row < height; row++) {
        for (var column = 0; column < width; column++) {
            // no asteroid here
            if (!map[row][column]) {
                continue;
            }
            // console.log(`Row: ${row}, column: ${column}`);
            const innerMap = clone(map);
            var length = 1;
            while (length < width || length < height) {
                // console.log('length', length);
                // console.log(innerMap);
                var minCol = column - length;
                var minRow = row - length;
                var maxCol = column + length;
                var maxRow = row + length;
                var xDiff;
                var yDiff;
                for (var i = minCol; i <= maxCol; i++) {
                    if (i < 0 || i >= width || minRow < 0) {
                        continue;
                    }
                    xDiff = i - column;
                    yDiff = minRow - row;
                    if (xDiff === 0 && yDiff === 0) {
                        continue;
                    }
                    // console.log('->', `${minRow}|${i}`, xDiff, yDiff, innerMap[minRow][i]);
                    invalidate(i, minRow, xDiff, yDiff, innerMap, column, row);
                }
                for (i = minRow + 1; i <= maxRow; i++) {
                    if (i < 0 || i >= height || maxCol >= width) {
                        continue;
                    }
                    xDiff = maxCol - column;
                    yDiff = i - row;
                    if (xDiff === 0 && yDiff === 0) {
                        continue;
                    }
                    // console.log('\\\/', `${i}|${maxCol}`, xDiff, yDiff, innerMap[i][maxCol]);
                    invalidate(maxCol, i, xDiff, yDiff, innerMap, column, row);
                }
                for (i = maxCol - 1; i >= minCol; i--) {
                    if (i < 0 || i >= width || maxRow >= height) {
                        continue;
                    }
                    xDiff = i - column;
                    yDiff = maxRow - row;
                    if (xDiff === 0 && yDiff === 0) {
                        continue;
                    }
                    // console.log('<-', `${maxRow}|${i}`, xDiff, yDiff, innerMap[maxRow][i]);
                    invalidate(i, maxRow, xDiff, yDiff, innerMap, column, row);
                }
                for (i = maxRow - 1; i > minRow; i--) {
                    if (i < 0 || i >= height || minCol < 0) {
                        continue;
                    }
                    xDiff = minCol - column;
                    yDiff = i - row;
                    if (xDiff === 0 && yDiff === 0) {
                        continue;
                    }
                    // console.log('^', `${i}|${minCol}`, xDiff, yDiff, innerMap[i][minCol]);
                    invalidate(minCol, i, xDiff, yDiff, innerMap, column, row);
                }
                length++;
            }
        }
    }
    var max = 0;
    console.log(Array.from(counts).reduce((acc, value) => {
        if (value[1] > max) {
            max = value[1];
            acc = value[0];
        }
        return acc;
    }, 0), max);
});
