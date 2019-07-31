var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/day3.input')
});

var good = 0;

lineReader.on('line', function(line) {
    const vertices = line.trim().split(/\s+/).map(value => parseInt(value, 10));
    if (vertices[0] + vertices[1] > vertices[2]
        && vertices[1] + vertices[2] > vertices[0]
        && vertices[2] + vertices[0] > vertices[1]) {
        good++;
    }
});

lineReader.on('close', function() {
    console.log(good);
});
