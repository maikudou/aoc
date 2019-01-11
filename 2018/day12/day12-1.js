var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/test')
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

function sum() {
    var sum = 0;
    for (var i = 0; i < newPots.length; i++) {
        if (newPots[i]) {
            sum += i - centerIndex;
        }
    }
    return sum;
};

var sums = new Set();
var sumsArray = [];
var nextSum;
var hasCandidate = false;

lineReader.on('close', function () {
    for (var i = 0; i < initialState.length; i++) {
        pots.push(initialState[i] == "#" ? 1 : 0);
    }

    var start = Date.now();
    for (i = 0; i < 200; i++) {
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

        var runningSum = sum();

        if (sums.has(runningSum)) {
            console.log("Possible", i);
            if (hasCandidate) {
                if (nextSum == runningSum) {
                    console.log("Found Cycle", i-1);
                    break;
                } else {
                    nextSum = null;
                    hasCandidate = false;
                }
            } else {
                nextSum = sumsArray[sumsArray.indexOf(runningSum)+1];
                hasCandidate = true;
            }
        } else if (hasCandidate) {
            hasCandidate = false;
        }

        sums.add(runningSum);
        sumsArray.push(runningSum);

        pots = newPots;
    }

    console.log(sum());
    console.log(`Done in ${Date.now() - start}ms`);
    console.log(sumsArray);
});
