var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

class MaxHeap {
    constructor() {
        this._arr = [];
    }

    insert(value) {
        this._arr.push(value);
        this._bubbleUp(this._arr.length-1);
    }

    pop() {
        this._swap(0, this._arr.length-1);
        var returnedValue = this._arr.pop();
        this._bubbleDown(0);
        return returnedValue;
    }

    getTop() {
        return this._arr[0];
    }

    get length() {
        return this._arr.length;
    }

    _bubbleUp(index) {
        var parentIndex = this._getParentIndex(index);
        if (parentIndex < 0) {
            return;
        }
        if (this._compare(this._arr[index], this._arr[parentIndex])) {
            this._swap(index, parentIndex);
            this._bubbleUp(parentIndex);
        }
    }

    _bubbleDown(index) {
        var leftChildIndex = this._getLeftChildIndex(index);
        var rightChildIndex = this._getRightChildIndex(index);
        var maxChildIndex;

        if (rightChildIndex < this._arr.length
            && leftChildIndex < this._arr.length - 1
            && this._compare(this._arr[rightChildIndex], this._arr[leftChildIndex])) {
            maxChildIndex = rightChildIndex;
        } else {
            maxChildIndex = leftChildIndex;
        }

        if (typeof this._arr[maxChildIndex] == 'undefined') {
            return;
        }

        if (this._compare(this._arr[maxChildIndex], this._arr[index])) {
            this._swap(maxChildIndex, index);
            this._bubbleDown(maxChildIndex);
        }
    }

    _compare(a, b) {
        return a > b;
    }

    _swap(indexA, indexB) {
        var temp = this._arr[indexB];
        this._arr[indexB] = this._arr[indexA];
        this._arr[indexA] = temp;
    }

    _getParentIndex(index) {
        return Math.floor((index-1)/2);
    }
    _getLeftChildIndex(index) {
        return index * 2 + 1
    }
    _getRightChildIndex(index) {
        return index * 2 + 2
    }
}

class DateMaxHeap extends MaxHeap {
    constructor() {
        super();
    }

    _compare(a, b) {
        return a.substr(1, 16) < b.substr(1, 16);
    }
}

var h = new DateMaxHeap();

lineReader.on('line', function (line) {
    h.insert(line);
});

var currentShift;
const guards = new Map();

lineReader.on('close', function () {
    while (h.length) {
        var line = h.pop();
        var shiftBegins = / (\d\d):(\d\d)] Guard #(\d+) begins shift/.exec(line);
        var fallsAsleep = / (\d\d):(\d\d)] falls asleep/.exec(line);
        var wakesUp = / (\d\d):(\d\d)] wakes up/.exec(line);

        if (shiftBegins) {
            if (!guards.has(shiftBegins[3])) {
                guards.set(shiftBegins[3], {
                    id: shiftBegins[3],
                    sleptFor: 0,
                    mins: new Map()
                })
            }
            currentShift = guards.get(shiftBegins[3]);
        } else if (fallsAsleep) {
            currentShift.startSleep = parseInt(fallsAsleep[2])
        } else if (wakesUp) {
            currentShift.sleptFor += parseInt(wakesUp[2]) - currentShift.startSleep;
            for (var i = currentShift.startSleep; i < parseInt(wakesUp[2]); i++) {
                if (currentShift.mins.has(i)) {
                    currentShift.mins.set(i, currentShift.mins.get(i)+1);
                } else {
                    currentShift.mins.set(i, 1);
                }
            }
            delete currentShift.startSleep;
        }
    }
    var guardsInterator = guards.values();
    var guardsNext = guardsInterator.next().value;
    var maxSlept = 0;
    var maxSleptGard;
    while (guardsNext) {
        if (guardsNext.sleptFor > maxSlept) {
            maxSlept = guardsNext.sleptFor;
            maxSleptGard = guardsNext.id;
        }
        guardsNext = guardsInterator.next().value;
    }
    // console.log(guards);

    var guard = guards.get(maxSleptGard);

    var minsIterator = guard.mins.keys();
    var minNext = minsIterator.next().value;
    var min;
    var maxMinCount = 0;
    var maxMin;
    while (minNext) {
        min = guard.mins.get(minNext);
        if (min > maxMinCount) {
            maxMin = minNext;
            maxMinCount = min;
        }
        minNext = minsIterator.next().value;
    }
    console.log(parseInt(maxSleptGard) * maxMin);
});
