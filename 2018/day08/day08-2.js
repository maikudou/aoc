var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var input;

function parseNode(start) {
    var sum = 0;
    var childCount = input[start];
    var metaCount = input[start + 1];
    var nextIndex = start + 2;

    if (childCount === 0) {
        for (var i = 0; i < metaCount; i++) {
            sum += input[start + 2 + i];
        }
        return [sum, start + 2 + metaCount];
    } else {
        var childrenSums = [];
        while(childCount) {
            var [ nextSum, nextEnd ] = parseNode(nextIndex);
            childrenSums.push(nextSum);
            nextIndex = nextEnd;
            childCount--;
        }
        for (var i = 0; i < metaCount; i++) {
            var nextChildIndex = input[nextIndex + i] - 1;
            if (nextChildIndex > -1 && childrenSums[nextChildIndex]) {
                sum += childrenSums[nextChildIndex];
            }
        }
        return [ sum, nextIndex + metaCount];
    }
}

lineReader.on('line', function (line) {
    input = line.split(" ").map(Number);
    var [ sum ] = parseNode(0);
    console.log(sum);
});

lineReader.on('close', function () {
    // var [ sum ] = parseNode(0);
    // console.log(sum);
});
