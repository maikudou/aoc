var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(`${__dirname}/day20.test-input`)
});

var rangesStarts = [];
var rangesEnds = new Map();

var min = Infinity;
var max = -Infinity;

lineReader.on('line', function(line) {
    line = line.split('-');
    rangesStarts.push(parseInt(line[0], 10));
    rangesEnds.set(parseInt(line[1], 10), parseInt(line[0], 10));
    min = Math.min(min, line[0]);
    max = Math.max(max, line[1]);
});

const currentRanges = new Set();

lineReader.on('close', function() {
    rangesStarts.sort(function(a, b) {
        if (a === b) {
            return 0;
        }
        return a > b ? 1 : -1;
    });

    var rangesEndsArray = Array.from(rangesEnds).sort(function(a, b) {
        if (a[0] === b[0]) {
            return 0;
        }
        return a[0] > b[0] ? 1 : -1;
    });

    var count = 0;
    var count = min;
    var i = min;
    var prevI = min;

    i = rangesStarts.shift();

    console.log(rangesStarts, rangesEndsArray, rangesEnds);

    while (i <= 4294967295) {
        console.log('i', i);
        if (currentRanges.size === 0) {
            count += i - prevI;
        }

        prevI = i;

        if (!rangesStarts.length && !rangesEndsArray.length) {
            count += 4294967295 - i;
            break;
        }

        if (rangesStarts.length && rangesEndsArray.length && rangesStarts[0] < rangesEndsArray[0][0]) {
            i = rangesStarts.shift();
            currentRanges.add(i);
        } else if (rangesStarts.length && rangesEndsArray.length && rangesStarts[0] >= rangesEndsArray[0][0]) {
            currentRanges.delete(rangesEnds.get(rangesEndsArray[0][0]));
            i = rangesEndsArray.shift()[0];
        } else if (!rangesStarts.length && rangesEndsArray.length) {
            currentRanges.delete(rangesEnds.get(rangesEndsArray[0][0]));
            i = rangesEndsArray.shift()[0];
        } else if (rangesStarts.length && !rangesEndsArray.length) {
            i = rangesStarts.shift();
            currentRanges.add(i);
        }
    }
    console.log(count);
});
