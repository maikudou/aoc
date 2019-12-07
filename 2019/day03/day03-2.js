/* eslint-disable complexity */
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var pathA;
var pathB;

function parseStep(step) {
    const regexp = /^([LRUD])(\d+)$/;
    const result = regexp.exec(step);

    return {
        dir: result[1],
        count: parseInt(result[2], 10)
    };
}

lineReader.on('line', function(line) {
    if (!pathA) {
        pathA = line.split(',').map(parseStep);
    } else {
        pathB = line.split(',').map(parseStep);
    }
});

lineReader.on('close', function() {
    var stepA = pathA.shift();
    var stepB = pathB.shift();
    var aX = 0;
    var aY = 0;
    var bX = 0;
    var bY = 0;
    var closest = Infinity;
    const mapA = new Map();
    var stepsA = 0;
    var stepsB = 0;

    while (stepA) {
        while (stepA.count) {
            switch (stepA.dir) {
                case 'U':
                    aY++;
                    break;
                case 'D':
                    aY--;
                    break;
                case 'L':
                    aX--;
                    break;
                case 'R':
                    aX++;
                    break;
            }
            stepA.count--;
            stepsA++;
            if (!mapA.has(`${aX}|${aY}`)) {
                mapA.set(`${aX}|${aY}`, stepsA);
            }
        }
        stepA = pathA.shift();
    }
    while (stepB) {
        while (stepB.count) {
            switch (stepB.dir) {
                case 'U':
                    bY++;
                    break;
                case 'D':
                    bY--;
                    break;
                case 'L':
                    bX--;
                    break;
                case 'R':
                    bX++;
                    break;
            }
            stepB.count--;
            stepsB++;

            if (mapA.has(`${bX}|${bY}`)) {
                closest = Math.min(closest, mapA.get(`${bX}|${bY}`) + stepsB);
            }
        }
        stepB = pathB.shift();
    }
    console.log(closest);
});
