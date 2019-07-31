// const packages = [
//     1,
//     3,
//     5,
//     11,
//     13,
//     17,
//     19,
//     23,
//     29,
//     31,
//     37,
//     41,
//     43,
//     47,
//     53,
//     59,
//     67,
//     71,
//     73,
//     79,
//     83,
//     89,
//     97,
//     101,
//     103,
//     107,
//     109,
//     113
// ];

const packages = [
    1,
    2,
    3,
    4,
    5,
    7,
    8,
    9,
    10,
    11
];

const sum = packages.reduce(function(acc, value) {
    return acc += value;
}, 0);

const groupWeight = sum / 3;
console.log(groupWeight);

const matrix = [];

for (var i = 0; i <= packages.length; i++) {
    matrix[i] = [{count: 0, qe: 0}];
    if (i === 0) {
        for (var j = 1; j <= groupWeight; j++) {
            matrix[i][j] = {count: 0, qe: 0};
        }
    } else {
        for (var j = 1; j <= groupWeight; j++) {
            var weight = packages[packages.length - i];
            console.log(weight);
        }
    }
}

console.log(matrix);
