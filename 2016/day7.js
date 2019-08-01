var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/day7.input')
});

var count = 0;
var squareOpen = false;

lineReader.on('line', function(line) {
    var abbaInBrackets = false;
    var abba = false;
    squareOpen = false;
    for (var i = 0; i < line.length - 1; i++) {
        if (line[i] === '[') {
            squareOpen = true;
            continue;
        }
        if (line[i] === ']') {
            squareOpen = false;
            continue;
        }
        if (squareOpen) {
            if (line[i - 1] === line[i]
                && typeof line[i - 2] !== 'undefined'
                && typeof line[i + 1] !== 'undefined'
                && line[i - 2] === line[i + 1]
                && line[i - 2] !== line[i]) {
                abbaInBrackets = true;
                // console.log(`!!!${line[i - 2]}${line[i - 1]}${line[i]}${line[i +1]}`, line);
                break;
            }
        }

        if (line[i - 1] === line[i]
            && typeof line[i - 2] !== 'undefined'
            && typeof line[i + 1] !== 'undefined'
            && line[i - 2] === line[i + 1]
            && line[i - 2] !== line[i]) {
            abba = true;
            // console.log(`${line[i - 2]}${line[i - 1]}${line[i]}${line[i +1]}`, line);
        }
    }
    if (!abbaInBrackets && abba) {
        count++;
    }
});

lineReader.on('close', function() {
    console.log(count);
});
