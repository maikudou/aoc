var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var freq = 0;

lineReader.on('line', function (line) {
    freq += parseInt(line, 10);
});

lineReader.on('close', function () {
    console.log(freq);
});