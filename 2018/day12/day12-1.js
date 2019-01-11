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

function sum() {
    var sum = 0;
    for (var i = 0; i < newPots.length; i++) {
        if (newPots[i]) {
            sum += i - centerIndex;
        }
    }
    return sum;
};

function brent(array) {
    var power, lam;
    power = lam = 1;
    var tortoise = 0;
    var hare = 1;
    while (array[tortoise] != array[hare]) {
        if (power == lam) {
            tortoise = hare;
            power *= 2;
            lam = 0;
        }
        hare++;
        lam++;
        if (hare > array.length-1) {
            console.log("No cycle");
            return;
        }
    }

    var mu = 0;
    tortoise = hare = 0;
    for (var i = 0; i < lam; i++) {
        hare++;
    }

    while (array[tortoise] != array[hare]) {
        tortoise++;
        hare++;
        mu++;
    }

    console.log(mu, lam);
}

function floyd(array) {
    var tortoise = 0;
    var hare = 1;
    while (array[tortoise] != array[hare]) {
        tortoise++;
        hare = tortoise*2;
        if (hare > array.length-1) {
            console.log("No cycle");
            return;
        }
    }

    var mu = 0
    var tortoise = 0;

    while (array[tortoise] != array[hare]) {
        tortoise++;
        hare++;
        mu++;
    }

    var lam = 1
    hare = tortoise+1;
    while (array[tortoise] != array[hare]) {
        hare++;
        lam++;
    }

    console.log(mu, lam, array[tortoise], array[tortoise+1], array[tortoise+2]);
}

var sumsArray = [];

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
        // var leftPots = "0" + newPots.slice(0, centerIndex-1).join("");
        // var rightPots = newPots.slice(centerIndex).reverse().join("");
        // console.log(parseInt(leftPots, 2), leftPots);
        // console.log(parseInt(rightPots, 2), rightPots);
        // sumsArray.push(parseInt(leftPots, 2) + parseInt(rightPots, 2));

        pots = newPots;
    }

    console.log(sum());
    console.log(`Done in ${Date.now() - start}ms`);

    // brent(sumsArray);
    // floyd(sumsArray);

    // console.log(sumsArray.slice(0,20));
});
