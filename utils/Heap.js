class Heap {
    constructor() {
        this._arr = [];
    }

    insert(value) {
        this._arr.push(value);
        this._bubbleUp(this._arr.length - 1);
    }

    pop() {
        this._swap(0, this._arr.length - 1);
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

        if (typeof this._arr[maxChildIndex] === 'undefined') {
            return;
        }

        if (this._compare(this._arr[maxChildIndex], this._arr[index])) {
            this._swap(maxChildIndex, index);
            this._bubbleDown(maxChildIndex);
        }
    }

    _compare() {
        throw new Error('_compare method unimplemented');
    }

    _swap(indexA, indexB) {
        var temp = this._arr[indexB];
        this._arr[indexB] = this._arr[indexA];
        this._arr[indexA] = temp;
    }

    _getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    _getLeftChildIndex(index) {
        return index * 2 + 1;
    }
    _getRightChildIndex(index) {
        return index * 2 + 2;
    }
}

class MaxHeap extends Heap {
    _compare(a, b) {
        return a > b;
    }
}

class MinHeap extends Heap {
    _compare(a, b) {
        return a < b;
    }
}

module.exports = {
    Heap,
    MaxHeap,
    MinHeap
};
