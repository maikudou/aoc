var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('input')
});

var hashMap;
var words;
var word;
var valid;
var count = 0;

lineReader.on('line', function (line) {
    hashMap = {};
    valid = true;
    words = line.split(/\s+/);
    for (var i = 0; i < words.length; i++) {
        word = words[i].split("").sort().join("");
        if(hashMap[word]) {
            valid = false;
            break;
        }
        hashMap[word] = true;
    }
    count += valid ? 1 : 0;
});

lineReader.on('close', function () {
    console.log(count);
});