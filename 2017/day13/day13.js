var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var fwConfig = [];
var line;

lineReader.on('line', function (line) {
    line = line.split(": ");
    fwConfig[line[0]] = Number(line[1]);
});

lineReader.on('close', function () {
    var cought;
    var cIndex;
    var severitySum = 0;
    var depth;

    for (var i = 0; i < fwConfig.length; i++) {
        caught = false;
        if (fwConfig[i]) {
            depth = fwConfig[i];
            cIndex = (depth-1)*2;
            caught = i % cIndex == 0;
        }
        if (caught) {
            severitySum += i * depth;
        }
    }

    console.log(severitySum);
});