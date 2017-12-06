var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var hashMap;
var words;
var valid;
var count = 0;

lineReader.on('line', function (line) {
    hashMap = {};
    valid = true;
    words = line.split(/\s+/);
    for (var i = 0; i < words.length; i++) {
        if(hashMap[words[i]]) {
            valid = false;
            break;
        }
        hashMap[words[i]] = true;
    }
    count += valid ? 1 : 0;
});

lineReader.on('close', function () {
    console.log(count);
});