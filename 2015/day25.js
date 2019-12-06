const manualRow = 3010;
const manualColumn = 3019;

const startingNum = 20151125;

const matrix = [['-'], [1, startingNum]];

for (var row = 2; row <= Math.max(manualColumn, manualRow) * 2; row++) {
    matrix[row] = [row];
    for (var col = 1; col <= row; col++) {
        matrix[0][col] = col;
        var newRow = row + 1 - col;
        var prev;
        if (col === 1) {
            prev = matrix[1][row - 1];
        } else {
            prev = matrix[row + 2 - col][col - 1];
        }
        var next = prev * 252533 % 33554393;
        matrix[newRow][col] = next;
    }
}

// console.log(matrix.map(function(value){ return value.join('\t') }).join('\n'));
console.log(matrix[manualRow][manualColumn]);
