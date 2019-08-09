var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(`${__dirname}/day20.input`)
});

var rangesStarts = new Set();
var rangesEnds = new Map();

lineReader.on('line', function(line) {
    line = line.split('-');
    rangesStarts.add(parseInt(line[0], 10));
    rangesEnds.set(parseInt(line[1], 10), parseInt(line[0], 10));
});

const currentRanges = new Set();

lineReader.on('close', function() {
    // console.log(rangesStarts, rangesEnds);
    var valid = false;
    var i = 0;
    while (!valid) {
        if (rangesStarts.has(i)) {
            currentRanges.add(i);
        }
        if (currentRanges.size === 0) {
            valid = true;
            break;
        }
        if (rangesEnds.has(i)) {
            currentRanges.delete(rangesEnds.get(i));
        }
        i++;
    }

    console.log(i);
});
