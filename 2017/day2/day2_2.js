var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var sum = 0;
var lineArray;
var current;
var current2;
var devisable;
var divider;

lineReader.on('line', function (line) {
    lineArray = line.split(/\s+/);
    devisable = null;
    devider = null;
    for (var i = 0; i < lineArray.length; i++) {
        current = parseInt(lineArray[i]);
        for (var j = 0; j < lineArray.length; j++) {
            if (i != j) {
                current2 = parseInt(lineArray[j]);
                if (current%current2 == 0) {
                    devisable = current;
                    devider = current2;
                    break;
                } else if (current2%current == 0) {
                    devisable = current2;
                    devider = current;
                    break;
                }
            }
        }
        if (devisable) {
            break;
        }
    }
    sum += (devisable/devider);
});

lineReader.on('close', function () {
    console.log(sum);
});