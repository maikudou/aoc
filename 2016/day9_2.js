var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/day9.input')
});

function recursiveLength(string) {
    var scan = 0;
    var length = 0;
    while (scan < string.length) {
        if (string[scan] !== '(') {
            length++;
            scan++;
        } else {
            var closerIndex = string.indexOf(')', scan);
            var instruction = string.substr(scan + 1, closerIndex - scan - 1);
            const [, count, times] = /(\d+)x(\d+)/.exec(instruction);

            length += parseInt(times, 10) * recursiveLength(string.substr(closerIndex + 1, count));

            scan = closerIndex + 1 + parseInt(count, 10);
        }
    }
    return length;
}

lineReader.on('line', function(line) {
    console.log(recursiveLength(line));
});

lineReader.on('close', function() {
});
