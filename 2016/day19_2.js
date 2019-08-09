const input = 3001330; // 3001330;

var elves = new Array(input);
for (var i = 0; i < input; i++) {
    elves[i] = { i: i + 1, p: 1 };
}

// i = 0;
// var nextI;
// var nextIBack;

// while (true) { // eslint-disable-line
//     // console.log(elves);
//     while (elves[i] === 0) {
//         i++;
//         if (i === input) {
//             i = 0;
//         }
//     }

//     nextI = i + 1;
//     if (nextI >= input - 1) {
//         nextI = 0;
//     }

//     nextIBack = i - 1;
//     if (nextIBack < 0) {
//         nextIBack = input - 1;
//     }

//     var restrainer = 0;

//     while (nextI !== nextIBack) {
//         if (restrainer++ > input) {
//             console.log(nextI, nextIBack);
//             process.exit();
//         }
//         while (elves[nextI] === 0) {
//             nextI++;
//             if (nextI === input) {
//                 nextI = 0;
//             }
//         }

//         while (elves[nextIBack] === 0) {
//             nextIBack--;
//             if (nextIBack === -1) {
//                 nextIBack = input - 1;
//             }
//         }

//         if (nextI === nextIBack) {
//             break;
//         }

//         nextI++;
//         if (nextI >= input - 1) {
//             nextI = 0;
//         }

//         if (nextI === nextIBack) {
//             nextI--;
//             if (nextI < 0) {
//                 nextI = input - 1;
//             }
//             break;
//         }

//         nextIBack--;
//         if (nextIBack < 0) {
//             nextIBack = input - 1;
//         }
//     }

//     // console.log('nextI', nextI);

//     if (i === nextI) {
//         break;
//     }
//     elves[i] += elves[nextI];

//     if (elves[i] === input) {
//         break;
//     }

//     elves[nextI] = 0;

//     i++;
//     if (i >= input) {
//         i = 0;
//     }
// }
i = 0;
while (elves.length > 1) {
    var nextI = i + Math.floor(elves.length / 2);

    if (nextI >= elves.length) {
        nextI = nextI - elves.length;
    }

    // console.log(elves[nextI].i, i);
    elves[i].p += elves[nextI].p;
    elves.splice(nextI, 1);
    i++;
    if (i >= elves.length) {
        i = 0;
    }

}

console.log(elves[0].i);
