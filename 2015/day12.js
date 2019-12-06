const fs = require('fs');

const file = fs.readFileSync('./day12.input');
const data = JSON.parse(file.toString());
var sum = 0;

function parseAndSum(item) {
    if (typeof item === 'object') {
        var keys = Object.keys(item);
        for (var i = 0; i < keys.length; i++) {
            if (typeof item[keys[i]] === 'number') {
                sum += item[keys[i]];
            } else {
                parseAndSum(item[keys[i]]);
            }
        }
    }
}

parseAndSum(data);

console.log(sum);
