var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day2.input')
});

var wrap = 0;
var ribbon = 0;

lineReader.on('line', function(line) {
    var dims = line.split('x');
    var sums = [];
    sums.push(parseInt(dims[0] * dims[1], 10));
    sums.push(parseInt(dims[1] * dims[2], 10));
    sums.push(parseInt(dims[2] * dims[0], 10));

    sums = sums.sort(function(a, b) { return a - b; });

    var ribbons = [];
    ribbons.push(parseInt(dims[0] * 2 + dims[1] * 2, 10));
    ribbons.push(parseInt(dims[1] * 2 + dims[2] * 2, 10));
    ribbons.push(parseInt(dims[2] * 2 + dims[0] * 2, 10));

    ribbons = ribbons.sort(function(a, b) { return a - b; });

    wrap += sums[0] * 3 + sums[1] * 2 + sums[2] * 2;
    ribbon += ribbons[0] + dims[0] * dims[1] * dims[2];
});

lineReader.on('close', function() {
    console.log('Wrap: ' + wrap);
    console.log('Ribbon: ' + ribbon);
});
