const input = 3001330; // 3001330;

const root = {
    i: 1,
    p: 1
};

var nextRoot = root;

for (var i = 1; i < input; i++) {
    var next = {
        i: i + 1,
        p: 1,
        prev: nextRoot
    };
    nextRoot.next = next;
    nextRoot = next;
}

root.prev = nextRoot;
nextRoot.next = root;

nextRoot = root;

var currentSize = input;

while (nextRoot && currentSize > 1) {
    if (currentSize % 1000 === 0) {
        console.log(currentSize);
    }
    // console.log('root', nextRoot.i);

    if (nextRoot.next === nextRoot) {
        break;
    }

    var nextVictim = nextRoot;

    for (i = currentSize % 2 ? 1 : 0; i < currentSize / 2; i++) {
        nextVictim = nextVictim.next;
    }

    // console.log('victim', nextVictim.i);

    nextRoot.p += nextVictim.p;

    nextVictim.prev.next = nextVictim.next;
    nextVictim.next.prev = nextVictim.prev;
    currentSize--;

    nextRoot = nextRoot.next;
}

console.log(nextRoot.i);
