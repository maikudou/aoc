var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var instructions = [];
var index = 0;
var length;
var jumps = 0;
var nextIndex;

lineReader.on('line', function (line) {
    instructions.push(Number(line));
});

lineReader.on('close', function () {
    length = instructions.length;
    while (index < length) {
        nextIndex = index + instructions[index];
        instructions[index]++;
        index = nextIndex;
        jumps++;
    }
    console.log(jumps);
});