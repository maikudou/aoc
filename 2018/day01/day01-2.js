var freq = 0;
var reached = new Set();
reached.add(freq);

function search() {
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(__dirname + '/input')
    });
    lineReader.on('line', function (line) {
        freq += parseInt(line, 10);
        if (reached.has(freq)) {
            console.log(freq);
            process.exit(0);
        }
        reached.add(freq);
    });
    lineReader.on('close', function () {
        search();
    });
}

search();
