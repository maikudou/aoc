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
    const setA = new Set();

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
            setA.add(`${aX}|${aY}`);
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

            if (setA.has(`${bX}|${bY}`)) {
                closest = Math.min(closest, Math.abs(bX) + Math.abs(bY));
            }
        }
        stepB = pathB.shift();
    }
    console.log(closest);
});
