var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var minX = Infinity;
var minY = Infinity;
var maxX = 0;
var maxY = 0;
var maxDistance;

var grid = new Map();

lineReader.on('line', function (line) {
    line = line.split(", ");
    minX = Math.min(minX, line[0]);
    minY = Math.min(minY, line[1]);
    maxX = Math.max(maxX, line[0]);
    maxY = Math.max(maxY, line[1]);
    maxDistance = (maxY - minY + maxX - minY - 1);

    const distances = new Map();
    distances.set(line.join(","), 0);

    grid.set(line.join(","), {
        x: line[0],
        y: line[1],
        distances: distances
    })
});

function queueNodeNeightbors(node, initialNode, queue) {
    var initialNodeIndex = `${initialNode.x},${initialNode.y}`;
    var nextNodeIndex;
    var nextNode;
    var nextNodeDistancesArray;
    var nextNodeDistance;
    var x = parseInt(node.x);
    var y = parseInt(node.y);
    var initialNodeX = parseInt(initialNode.x);
    var initialNodeY = parseInt(initialNode.y);
    var distance = node.distances.get(initialNodeIndex);
    var newDistance;
    var isGood;

    for (var i = x-1; i <= x+1; i++) {
        for (var j = y-1; j <= y+1; j++) {
            if (i == x && j == y) {
                continue;
            }
            if (i < minX || i > maxX || j < minY || j > maxY) {
                continue;
            }

            newDistance = Math.abs(i - initialNodeX) + Math.abs(j - initialNodeY);

            nextNodeIndex = `${i},${j}`;

            if (newDistance > maxDistance || nextNodeIndex == initialNodeIndex) {
                continue;
            }

            // console.log("==", nextNodeIndex, newDistance);

            if (!grid.has(nextNodeIndex)) {
                // console.log("dontHave", nextNodeIndex);
                distances = new Map();
                distances.set(initialNodeIndex, newDistance);
                grid.set(nextNodeIndex, {
                    x: i,
                    y: j,
                    distances: distances
                });

                queue.push(nextNodeIndex);
            } else {
                nextNode = grid.get(nextNodeIndex);

                if (nextNode.distances.has(initialNodeIndex)) {
                    continue;
                }

                isGood = true;
                nextNodeDistancesArray = Array.from(nextNode.distances.values());
                nextNodeDistance = nextNodeDistancesArray.shift();
                while (nextNodeDistance) {
                    if (nextNodeDistance <= distances) {
                        isGood = false;
                        break;
                    }
                    nextNodeDistance = nextNodeDistancesArray.shift();
                }

                if (isGood) {
                    nextNode.distances.set(initialNodeIndex, newDistance);
                    queue.push(nextNodeIndex);
                }
            }
        }

    }
};

function getClosestCount(node) {
    var initialNodeIndex = `${node.x},${node.y}`;
    var closestCount = 1;
    const queue = [];
    var d = 'r';
    var w = 2;
    var xInc = 0;
    var yInc = 0;
    var x = node.x - 1;
    var y = node.y - 1;
    var isGood = true;
    var nextNodeIndex;
    var nextNode;
    var c = 0
    var changedCount = false;

    while (isGood && c++ <300) {
        nextNodeIndex = `${x},${y}`;
        // console.log(nextNodeIndex);

        if (grid.has(nextNodeIndex)) {
            nextNode = grid.get(nextNodeIndex);

            var selfDistance = nextNode.distances.get(initialNodeIndex);
            var selfDistanceIsMin = true;

            var nextDistancesArray = Array.from(nextNode.distances.keys());
            while (nextDistancesArray.length) {
                var nextDistanceIndex = nextDistancesArray.shift();
                if (nextDistanceIndex == initialNodeIndex) {
                    continue;
                }
                var nextDistance = nextNode.distances.get(nextDistanceIndex);
                if (nextDistance <= selfDistance) {
                    selfDistanceIsMin = false;
                }
            }

            if (selfDistanceIsMin) {
                // console.log('adding', nextNodeIndex, selfDistance, nextNode.distances);
                closestCount++;
                changedCount = true;
            } else {
                // console.log('not adding', nextNodeIndex, selfDistance, nextNode.distances);
            }
        }

        // console.log(d, w, xInc, yInc);

        switch (d) {
            case 'r':
                if (xInc == w) {
                    d = 'd';
                }
                break;
            case 'd':
                if (yInc == w) {
                    d = 'l';
                }
                break;
            case 'l':
                if (xInc == 0) {
                    d = 'u';
                }
                break;
            case 'u':
                if (yInc == 1) {
                    if (!changedCount) {
                        isGood = false;
                    }
                    d = 'r';
                    w += 2;
                    x -= 2;
                    y -= 2;
                    xInc = -1;
                    yInc = 0;
                    changedCount = false;
                }
                break;
        }


        switch (d) {
            case 'r':
                x++;
                xInc++;
                break;
            case 'd':
                y++;
                yInc++;
                break;
            case 'l':
                x--;
                xInc--;
                break;
            case 'u':
                y--;
                yInc--;
                break;
        }
    }
    return closestCount;
}

lineReader.on('close', function () {
    // console.log(minX, minY, maxX, maxY, maxDistance);
    // console.log(grid);

    const gridArray = Array.from(grid.keys());
    const initialGridArray = gridArray.slice();
    var next = gridArray.shift();
    var node = grid.get(next);
    var queue = [];

    var topCount = 0;

    while (next) {
        queue = [];
        node = grid.get(next);

        queueNodeNeightbors(node, node, queue);

        var nextNode;

        var count = 0;

        while (queue.length) {
            nextNode = grid.get(queue.shift());
            queueNodeNeightbors(nextNode, node, queue);
        }
        next = gridArray.shift();
    }

    // console.log(grid);

    var maxCount = 0;

    while(initialGridArray.length) {
        var nextInitialNode = initialGridArray.shift();
        var [x,y] = nextInitialNode.split(",");
        if (x > minX && x < maxX && y > minY && y < maxY) {
            // console.log(nextInitialNode);
            // console.log(grid.get(nextInitialNode));
            // console.log(getClosestCount(grid.get(nextInitialNode)));
            maxCount = Math.max(maxCount, getClosestCount(grid.get(nextInitialNode)));
        }
    }

    console.log(maxCount);

});
