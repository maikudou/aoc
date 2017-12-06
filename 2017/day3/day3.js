const input = 265149;
var width = 1;
var height = 1;
var value = 1;
var direction = "R";
var current = 0;

var x = 0;
var y = 0;

while (current < input) {
    switch(direction) {
        case "R":
            for(var i = 0; i < width && current < input; i++) {
                current++;
                x++;
            }
            width += 2;
            direction = "U";
            break;
        case "U":
            for(var i = 0; i < height && current < input; i++) {
                current++;
                y++;
            }
            height += 2;
            direction = "L";
            break;
        case "L":
            for(var i = 0; i < width-1 && current < input; i++) {
                current++;
                x--;
            }
            direction = "D";
            break;
        case "D":
            for(var i = 0; i < height-1 && current < input; i++) {
                current++;
                y--;
            }
            direction = "R";
            break;
    }
}

console.log(Math.abs(x) + Math.abs(y));