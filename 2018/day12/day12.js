var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var initialState;
const rules = [];

var pots = [];
var newPots = [];
var centerIndex = 0;
var rule;
var test;
var value;

lineReader.on('line', function (line) {
    if (!initialState) {
        initialState = line.substr(15);
    } else if (line != "") {
        rules.push(line.slice(0,5).split("").map(function(char) {
            return char == "#" ? 1 : 0;
        }));
        rules[rules.length-1].push(line[9] == "#" ? 1 : 0);
    }
});

var patterns = new Set();

lineReader.on('close', function () {
    for (var i = 0; i < initialState.length; i++) {
        pots.push(initialState[i] == "#" ? 1 : 0);
    }

    var start = Date.now();
    for (i = 0; i < 20; i++) {
        newPots = pots.slice(0).map(()=> {return 0});
        unshift = 0;

        for (var j = -1; j <= pots.length; j++) {
            test = [
                j > 1 ? pots[j-2] : 0,
                j > 0 ? pots[j-1] : 0,
                j >= 0 && j < pots.length ? pots[j] : 0,
                j < pots.length - 1 ? pots[j+1] : 0,
                j < pots.length - 2 ? pots[j+2] : 0
            ];
            for (var r = 0; r < rules.length; r++) {
                rule = rules[r];
                var match = true;
                for (var k = 0; k < test.length; k++) {
                    if (test[k] != rule[k]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    value = rule[5];
                    if (j == -1 && value) {
                        newPots.unshift(1);
                        centerIndex++;
                        unshift++
                    } else if (j == pots.length && value) {
                        newPots.push(1);
                    } else {
                        newPots[j+unshift] = value;
                    }
                    break;
                }
            }
        }

        pots = newPots;
    }

    var sum = 0;
    for (var i = 0; i < newPots.length; i++) {
        if (newPots[i]) {
            sum += i - centerIndex;
        }
    }

    console.log(sum);
    console.log(`Done in ${Date.now() - start}ms`);
});
