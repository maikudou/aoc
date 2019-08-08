const input = 3001330;

var elves = [];
for (var i = 0; i < input; i++) {
    elves.push(1);
}

i = 0;
var nextI;

while (true) { // eslint-disable-line
    // console.log(elves);
    while (elves[i] === 0) {
        i++;
        if (i === input) {
            i = 0;
        }
    }

    nextI = i + 1;
    if (nextI >= input - 1) {
        nextI = 0;
    }

    while (elves[nextI] === 0) {
        nextI++;
        if (nextI === input) {
            nextI = 0;
        }
    }

    if (i === nextI) {
        break;
    }
    elves[i] += elves[nextI];

    if (elves[i] === input) {
        break;
    }

    elves[nextI] = 0;

    i++;
    if (i >= input) {
        i = 0;
    }
}

console.log(i + 1);
