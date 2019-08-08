const input = '...^^^^^..^...^...^^^^^^...^.^^^.^.^.^^.^^^.....^.^^^...^^^^^^.....^.^^...^^^^^...^.^^^.^^......^^^^';

const field = [input.split('')];
var safeCount = input.split('').reduce(function(acc, value) {
    acc += value === '.' ? 1 : 0;
    return acc;
}, 0);

for (var i = 0; i < 399999; i++) {
    var line = [];
    for (var j = 0; j < input.length; j++) {
        if (field[i][j - 1] === '^' && field[i][j] === '^' && field[i][j + 1] !== '^') {
            line.push('^');
        } else if (field[i][j - 1] !== '^' && field[i][j] === '^' && field[i][j + 1] === '^') {
            line.push('^');
        } else if (field[i][j - 1] === '^' && field[i][j] !== '^' && field[i][j + 1] !== '^') {
            line.push('^');
        } else if (field[i][j - 1] !== '^' && field[i][j] !== '^' && field[i][j + 1] === '^') {
            line.push('^');
        } else {
            line.push('.');
            safeCount++;
        }
    }
    field.push(line);
    if (i === 38) {
        console.log(safeCount);
    }
}

console.log(safeCount);
