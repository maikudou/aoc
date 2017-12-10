var input = "106,118,236,1,130,0,235,254,59,205,2,87,129,25,255,118".split(",");
var nodes = [];
for (var i = 0; i<256; i++) {
    nodes.push(i);
}

// input = "3,4,1,5".split(",");
// nodes = [];
// for (var i = 0; i<5; i++) {
//     nodes.push(i);
// }

var pos = 0;
var replacePos;
var skip = 0;
var length;
var selected;
var change;

for (var i = 0; i < input.length; i++) {
    length = parseInt(input[i]);
    if (length > nodes.length) {
        continue;
    }
    change =  pos + length - nodes.length;
    selected = nodes.slice(pos, pos + length);

    if (change > 0) {
        selected = selected.concat(nodes.slice(0, change));
    }
    selected.reverse();

    replacePos = pos;
    for (var j = 0; j < selected.length; j++) {
        if (replacePos == nodes.length) {
            replacePos = 0;
        }

        nodes[replacePos] = selected[j];

        replacePos++;
    }

    pos += length + skip;

    if (pos >= nodes.length) {
        pos = pos - nodes.length;
    }

    skip++;
}
console.log(nodes[0]*nodes[1]);
