var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day5.input')
});

var count = 0;

lineReader.on('line', function (line) {
    if(/xy|ab|cd|pq/gi.test(line)){
        return
    }
    if(/([aeiou].*[aeiou].*[aeiou])/gi.test(line)){
        if(/(.)\1{1,}/gi.test(line)){
            count++;
        }
        return
    }

});

lineReader.on('close', function () {
    console.log(count);
});
