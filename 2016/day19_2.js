const input = 5; // 3001330;

var elves = [];
for (var i = 0; i < input; i++) {
    elves.push(1);
}

i = 0;
var nextI;
var nextIBack;

var counter = 0;

while (true && counter < 5) { // eslint-disable-line
    console.log(elves);
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

    nextIBack = i - 1;
    if (nextIBack < 0) {
        nextIBack = input - 1;
    }

    while (nextI !== nextIBack) {
        console.log(1, nextI, nextIBack);
        while (elves[nextI] === 0) {
            nextI++;
            if (nextI === input) {
                nextI = 0;
            }
        }

        console.log(2, nextI, nextIBack);

        while (elves[nextIBack] === 0) {
            nextIBack--;
            if (nextIBack === -1) {
                nextIBack = input - 1;
            }
        }

        console.log(3, nextI, nextIBack);

        nextI++;
        if (nextI >= input - 1) {
            nextI = 0;
        }

        nextIBack--;
        if (nextIBack < 0) {
            nextIBack = input - 1;
        }
    }

    console.log('nextI', nextI);

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
