const crypto = require('crypto');

const input = 'mmsxrhfx';


function getAvailableMoves(path) {
    var hash = String(crypto.createHash('md5').update(input + path).digest('hex')).slice(0, 4);
    var moves = [false, false, false, false];
    const good = new Set(['b', 'c', 'd', 'e', 'f']);
    for (var i = 0; i < 4; i++) {
        if (good.has(hash[i])) {
            moves[i] = true;
        }
    }
    return moves;
}

// const initialNode = {
//     path: '',
//     x: 0,
//     y: 0
// };

var totalMinPath = Infinity;
var longestPath = 0;

function dfs(node) { // eslint-disable-line complexity
    if (node.x === 3 && node.y === 3) {
        if (totalMinPath > node.path.length) {
            totalMinPath = node.path.length;
        }
        if (longestPath < node.path.length) {
            longestPath = node.path.length;
        }
        return node.path;
    }
    // if (node.path.length > totalMinPath) {
    //     return null;
    // }
    const availableMoves = getAvailableMoves(node.path);
    // console.log(node, availableMoves);
    var minPath = Infinity;
    var bestPath = null;
    var path;

    for (var i = 0; i < availableMoves.length; i++) {
        if (i === 0 && availableMoves[i] && node.y > 0) {
            path = dfs({
                path: node.path + 'U',
                x: node.x,
                y: node.y - 1
            });
            if (path && path.length < minPath) {
                bestPath = path;
                minPath = path.length;
            }
        }
        if (i === 1 && availableMoves[i] && node.y < 3) {
            path = dfs({
                path: node.path + 'D',
                x: node.x,
                y: node.y + 1
            });
            if (path && path.length < minPath) {
                bestPath = path;
                minPath = path.length;
            }
        }
        if (i === 2 && availableMoves[i] && node.x > 0) {
            path = dfs({
                path: node.path + 'L',
                x: node.x - 1,
                y: node.y
            });
            if (path && path.length < minPath) {
                bestPath = path;
                minPath = path.length;
            }
        }
        if (i === 3 && availableMoves[i] && node.x < 3) {
            path = dfs({
                path: node.path + 'R',
                x: node.x + 1,
                y: node.y
            });
            if (path && path.length < minPath) {
                bestPath = path;
                minPath = path.length;
            }
        }
    }

    return bestPath;
}

console.log(dfs({ path: '', x: 0, y: 0 }));
console.log(longestPath);
