const favNum = 1358;
const target = { x: 31, y: 39 };

function getCell(x, y) {
    const result = (x * x + 3 * x + 2 * x * y + y + y * y + favNum).toString(2);
    return result.split('').reduce(function(acc, value) {
        return acc + parseInt(value, 10);
    }, 0) % 2;
}

for (var j = 0; j <= 46; j++) {
    for (var i = 0; i <= 46; i++) {
        process.stdout.write(getCell(i, j) ? '===' : '...');
    }
    process.stdout.write('\n');
}

// process.stdout.write('\033[2A-');
// process.stdout.write('\033[2B\n');

const distances = new Map();
// const visited = new Set();

var queue = [{ x: 1, y: 1 }];
distances.set('1|1', 0);

var found = false;
var currentCell;

function distanceSort(a, b) {
    const xDa = Math.abs(target.x - a.x);
    const yDa = Math.abs(target.y - a.y);
    const distA = xDa + yDa;

    const xDb = Math.abs(target.x - b.x);
    const yDb = Math.abs(target.y - b.y);
    const distB = xDb + yDb;

    if (distA === distB) {
        return 0;
    } else {
        return distA > distB ? 1 : -1;
    }
}

function writeAtCell(str, x, y, currentPosition) {
    str = String(str);
    if (x > currentPosition.x) {
        process.stdout.write('\033[' + String(3 * 1 * x - currentPosition.x)+ 'C');
    }
    if (x < currentPosition.x) {
        process.stdout.write('\033[' + String(3 * 1 * currentPosition.x - x)+ 'D');
    }
    if (y < currentPosition.y) {
        process.stdout.write('\033[' + String(currentPosition.y - y)+ 'A');
    }
    if (y > currentPosition.y) {
        process.stdout.write('\033[' + String(y - currentPosition.y)+ 'B');
    }
    process.stdout.write(str);
    if (str.length) {
        process.stdout.write('\033[' + String(str.length)+ 'D');
    }
    if (x > currentPosition.x) {
        process.stdout.write('\033[' + String(3 * 1 * x - currentPosition.x)+ 'D');
    }
    if (x < currentPosition.x) {
        process.stdout.write('\033[' + String(3 * 1 * currentPosition.x - x)+ 'C');
    }
    if (y < currentPosition.y) {
        process.stdout.write('\033[' + String(currentPosition.y - y)+ 'B');
    }
    if (y > currentPosition.y) {
        process.stdout.write('\033[' + String(y - currentPosition.y)+ 'A');
    }
}

var cursorPosition = {
    x: 0,
    y: 47
}

writeAtCell('\033[1;31mX\033[0;37m', target.x, target.y, cursorPosition);

var locations = 0;

while (queue.length && !found ) {
    currentCell = queue.shift();
    // console.log(currentCell);
    var xVariants = [currentCell.x + 1];
    var yVariants = [currentCell.y + 1];
    var distance = distances.get(`${currentCell.x}|${currentCell.y}`);
    if (distance <= 50) {
        locations++;
    }

    writeAtCell(distance, currentCell.x, currentCell.y, cursorPosition);

    if (currentCell.x > 0) {
        xVariants.unshift(currentCell.x - 1);
    }
    if (currentCell.y > 0) {
        yVariants.unshift(currentCell.y - 1);
    }
    const nextCells = [];

    for (var i = 0; i < xVariants.length; i++) {
        var x = xVariants[i];
        var y = currentCell.y;

        // console.log(x, y, target.x, target.y, distances.get(`${x}|${y}`));

        if (x === target.x && y === target.y) {
            console.log(distance + 1);
            found = true;
        }
        if (!distances.has(`${x}|${y}`) && !getCell(x, y)) {
            // console.log('push', { x, y });
            nextCells.push({ x, y });
            distances.set(`${x}|${y}`, distance + 1);
        }
    }
    for (var j = 0; j < yVariants.length; j++) {
        var x = currentCell.x;
        var y = yVariants[j];

        // console.log(x, y, target.x, target.y, distances.get(`${x}|${y}`));

        if (x === target.x && y === target.y) {
            console.log(distance + 1);
            found = true;
        }
        if (!distances.has(`${x}|${y}`) && !getCell(x, y)) {
            // console.log('push', { x, y });
            nextCells.push({ x, y });
            distances.set(`${x}|${y}`, distance + 1);
        }
    }
    // console.log(nextCells);
    // nextCells.sort(distanceSort);
    // console.log(nextCells);
    queue = queue.concat(nextCells);
    // process.stdout.write('\033[10000;0H\n');
}
console.log(locations);
