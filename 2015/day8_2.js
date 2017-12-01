var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day8.input')
});
var totalLinesLength = 0;
var totalWordsLength = 0;

lineReader.on('line', function (line) {
    totalLinesLength += line.length;

    fatLine = line.replace(/(\\|\")/gi, '\\$1');
    console.log(line, line.length);
    console.log(fatLine, fatLine.length+2);
    totalWordsLength += fatLine.length+2
});

lineReader.on('close', function () {
    console.log(totalLinesLength, totalWordsLength, totalWordsLength-totalLinesLength);
});
