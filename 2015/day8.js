var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day8.input')
});
var totalLinesLength = 0;
var totalWordsLength = 0;

lineReader.on('line', function (line) {
    totalLinesLength += line.length;

    bareLine = line.replace(/\\\"|\\\\|\\x\w{2}/gi, '|');
    console.log(line, line.length);
    console.log(bareLine, bareLine.length-2);
    totalWordsLength += bareLine.length-2
});

lineReader.on('close', function () {
    console.log(totalLinesLength, totalWordsLength, totalLinesLength-totalWordsLength);
});
