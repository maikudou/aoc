var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/day3.input')
});

var good = 0;
var threes = [];

lineReader.on('line', function(line) {
    const vertices = line.trim().split(/\s+/).map(value => parseInt(value, 10));
    threes.push(vertices);
    if (threes.length === 3) {
        for (var i = 0; i < 3; i++) {
            if (threes[0][i] + threes[1][i] > threes[2][i]
                && threes[1][i] + threes[2][i] > threes[0][i]
                && threes[2][i] + threes[0][i] > threes[1][i]) {
                good++;
            }
        }
        threes = [];
    }
});

lineReader.on('close', function() {
    console.log(good);
});
