const { Heap } = require('../utils/Heap');
class BotHeap extends Heap {
    _compare(a, b) {
        return a.chips.length > b.chips.length;
    }
    _swap(indexA, indexB) {
        this._arr[indexB].index = indexA;
        this._arr[indexA].index = indexB;
        super._swap(indexA, indexB);
    }
    insert(value) {
        value.index = this._arr.length;
        super.insert(value);
    }
}

function numSort(a, b) {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
};

const map = new Map();
const outputs = [];
const heap = new BotHeap();

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/day10.input')
});

lineReader.on('line', function(line) {
    const [, what, whatNum, lowTo, lowToNum, highTo, highToNum, botNum] = /^(bot|value) (\d+) (?:gives low to (bot|output) (\d+) and high to (bot|output) (\d+))?(?:goes to bot (\d+))?$/.exec(line);
    if (what === 'value') {
        if (!map.has(botNum)) {
            map.set(botNum, {
                chips: [parseInt(whatNum, 10)],
                id: botNum,
                index: null
            });
            heap.insert(map.get(botNum));
        } else {
            map.get(botNum).chips.push(parseInt(whatNum, 10));
            map.get(botNum).chips = map.get(botNum).chips.sort(numSort);
            heap._bubbleUp(map.get(botNum).index);
        }
    } else if (!map.has(whatNum)) {
        map.set(whatNum, {
            chips: [],
            id: whatNum,
            index: null,
            instruction: {
                lowTo,
                lowToNum,
                highTo,
                highToNum
            }
        });
        heap.insert(map.get(whatNum));
    } else {
        map.get(whatNum).instruction = {
            lowTo,
            lowToNum,
            highTo,
            highToNum
        };
    }
});

lineReader.on('close', function() {
    var comparer;

    while (heap.length) {
        // 61, 17
        var top = heap.pop();
        if (top.chips[0] === 17 && top.chips[1] === 61) {
            comparer = top.id;
        }
        if (top.instruction.lowTo === 'bot') {
            map.get(top.instruction.lowToNum).chips.push(top.chips[0]);
            map.get(top.instruction.lowToNum).chips = map.get(top.instruction.lowToNum).chips.sort(numSort);
            heap._bubbleUp(map.get(top.instruction.lowToNum).index);
        } else {
            outputs[top.instruction.lowToNum] = top.chips[0];
        }
        if (top.instruction.highTo === 'bot') {
            map.get(top.instruction.highToNum).chips.push(top.chips[1]);
            map.get(top.instruction.highToNum).chips = map.get(top.instruction.highToNum).chips.sort(numSort);
            heap._bubbleUp(map.get(top.instruction.highToNum).index);
        } else {
            outputs[top.instruction.highToNum] = top.chips[1];
        }

        top.chips = [];
        heap._bubbleDown(map.get(top.id).index);
    }

    console.log(comparer);
    console.log(outputs[0] * outputs[1] * outputs[2]);
});
