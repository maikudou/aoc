var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var twice = 0;
var thrice = 0;
var twiceFound = false;
var thriceFound = false;

function increment(count) {
    if (count === 2 && !twiceFound) {
        twice++;
        twiceFound = true;
    }
    if (count === 3 && !thriceFound) {
        thrice++;
        thriceFound = true;
    }
}

lineReader.on('line', function (line) {
    twiceFound = thriceFound = false;
    line = line.split("").sort();
    var last;
    var count;
    for (var i=0; i<line.length; i++) {
        if (line[i] != last) {
            last = line[i];
            increment(count);
            count = 1;
        } else {
            count++;
        }
    }
    increment(count);
});

lineReader.on('close', function () {
    console.log(twice * thrice);
});