var input = 'R3, R1, R4, L4, R3, R1, R1, L3, L5, L5, L3, R1, R4, L2, L1, R3, L3, R2, R1, R1, L5, L2, L1, R2, L4, R1, L2, L4, R2, R2, L2, L4, L3, R1, R4, R3, L1, R1, L5, R4, L2, R185, L2, R4, R49, L3, L4, R5, R1, R1, L1, L1, R2, L1, L4, R4, R5, R4, L3, L5, R1, R71, L1, R1, R186, L5, L2, R5, R4, R1, L5, L2, R3, R2, R5, R5, R4, R1, R4, R2, L1, R4, L1, L4, L5, L4, R4, R5, R1, L2, L4, L1, L5, L3, L5, R2, L5, R4, L4, R3, R3, R1, R4, L1, L2, R2, L1, R4, R2, R2, R5, R2, R5, L1, R1, L4, R5, R4, R2, R4, L5, R3, R2, R5, R3, L3, L5, L4, L3, L2, L2, R3, R2, L1, L1, L5, R1, L3, R3, R4, R5, L3, L5, R1, L3, L5, L5, L2, R1, L3, L1, L3, R4, L1, R3, L2, L2, R3, R3, R4, R4, R1, L4, R1, L5'; // eslint-disable-line
var x = 0;
var y = 0;

// input = "R8, R4, R4, R8";

var vectorX = 0;
var vectorY = 1;
var prevVectorY;
var prevVectorX;

var coordsHash = {};
var coordsAsString;

var instrictionTurn;
var instrictionLength;
var cross = false;

var instructions = input.split(', ');
for (var i = 0; i < instructions.length; i++) {
    instrictionTurn = instructions[i][0];
    instrictionLength = Number(instructions[i].substr(1));

    prevVectorY = vectorY;
    prevVectorX = vectorX;

    if (instrictionTurn === 'R') {
        vectorY = vectorY ? 0 : -prevVectorX;
        vectorX = vectorX ? 0 : prevVectorY;
    } else {
        vectorY = vectorY ? 0 : prevVectorX;
        vectorX = vectorX ? 0 : -prevVectorY;
    }

    for (var j = 1; j <= instrictionLength; j++) {
        if (vectorX) {
            x += vectorX;
        } else {
            y += vectorY;
        }

        coordsAsString = String(x) + String(y);
        if (coordsHash[coordsAsString]) {
            cross = true;
            break;
        }
        coordsHash[coordsAsString] = true;
    }
    if (cross) {
        break;
    }

}

var distance = Math.abs(x) + Math.abs(y);

console.log(distance);
