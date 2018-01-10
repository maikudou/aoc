var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var pipes = [];
var count = 0;
var pipe;
var connectedPipes = [0];

lineReader.on('line', function (line) {
    line = line.split(" <-> ")[1].split(", ");

    pipe = line.map(Number);
    pipes.push(pipe);
});

lineReader.on('close', function () {
    var toCheck = pipes[0];
    var nextPipe;
    var connected = {0: true};
    while (toCheck.length) {
        nextPipe = toCheck.shift();
        pipe = pipes[nextPipe];
        connected[nextPipe] = true;
        for (var i = 0; i < pipe.length; i++) {
            if (!connected[pipe[i]]) {
                toCheck.push(pipe[i]);
            }
        }
    }
    console.log(Object.keys(connected).length);
});