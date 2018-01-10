var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var pipes = {};
var count = 0;
var pipe;
var connectedPipes = [0];
var pipesIndices;
var keys;
var i;
var j;

lineReader.on('line', function (line) {
    line = line.split(" <-> ");
    var pipeNumbers = line[1].split(", ");

    pipeNumbers = pipeNumbers.map(Number);
    pipes[Number(line[0])] = pipeNumbers;
});

lineReader.on('close', function () {
    pipesIndices = Object.keys(pipes);
    var groupCount = 0;
    while (pipesIndices.length) {
        pipesIndices = Object.keys(pipes);
        var toCheck = pipes[pipesIndices[0]].slice(0);
        var nextPipe;
        var connected = {};
        connected[pipesIndices[0]] = true;
        while (toCheck.length) {
            nextPipe = toCheck.shift();
            pipe = pipes[nextPipe];
            connected[nextPipe] = true;
            for (i = 0; i < pipe.length; i++) {
                if (!connected[pipe[i]]) {
                    toCheck.push(pipe[i]);
                }
            }
        }
        keys = Object.keys(connected);
        for (j = 0; j < keys.length; j++) {
            delete pipes[keys[j]];
        }
        groupCount++;
        pipesIndices = Object.keys(pipes);
    }
    console.log(groupCount);
});