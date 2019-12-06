var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/day9.input')
});

var result = '';

lineReader.on('line', function(line) {
    var scan = 0;
    while (scan < line.length) {
        console.log(scan);
        if (line[scan] !== '(') {
            result += line[scan];
            scan++;
        } else {
            var closerIndex = line.indexOf(')', scan);
            var instruction = line.substr(scan + 1, closerIndex - scan - 1);
            const [, count, times] = /(\d+)x(\d+)/.exec(instruction);

            for (var i = 0; i < parseInt(times, 10); i++) {
                result += line.substr(closerIndex + 1, count);
            }

            scan = closerIndex + 1 + parseInt(count, 10);
        }
    }
});

lineReader.on('close', function() {
    console.log(result.length);
});
