var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var registers = {};
var largestEverValue = 0;
var operatingRegister;
var operatingValue;
var operation;
var conditionRegister;
var condition;
var conditionValue;
var conditionIsTrue;

lineReader.on('line', function (line) {
    line = /(\w+) (\w+) ([\-\d]+) if (\w+) ([><=!]+) ([\-\d]+)/.exec(line);
    operatingRegister = line[1];
    if (typeof registers[operatingRegister] == "undefined") {
        registers[operatingRegister] = 0;
    }

    operation = line[2];
    operatingValue = Number(line[3]);
    conditionRegister = line[4];

    if (typeof registers[conditionRegister] == "undefined") {
        registers[conditionRegister] = 0;
    }

    condition = line[5];
    conditionValue = Number(line[6]);

    conditionIsTrue = false;
    switch (condition) {
        case "<":
            conditionIsTrue = registers[conditionRegister] < conditionValue
            break;
        case "<=":
            conditionIsTrue = registers[conditionRegister] <= conditionValue
            break;
        case ">":
            conditionIsTrue = registers[conditionRegister] > conditionValue
            break;
        case ">=":
            conditionIsTrue = registers[conditionRegister] >= conditionValue
            break;
        case "==":
            conditionIsTrue = registers[conditionRegister] == conditionValue
            break;
        case "!=":
            conditionIsTrue = registers[conditionRegister] != conditionValue
            break;
    }

    if (conditionIsTrue) {
        registers[operatingRegister] = registers[operatingRegister]
             + (operation == "dec" ? -1 : 1) * operatingValue;
    }

    if (registers[operatingRegister] > largestEverValue) {
        largestEverValue = registers[operatingRegister];
    }
});

lineReader.on('close', function () {
    var largestValue = 0;
    var currentValue;
    var registersNames = Object.keys(registers);
    for (var i = 0; i < registersNames.length; i++) {
        currentValue = registers[registersNames[i]];
        if (currentValue > largestValue) {
            largestValue = currentValue;
        }
    }
    console.log(largestValue, largestEverValue);
});
