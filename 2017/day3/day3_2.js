const input = 265149;
var width = 1;
var height = 1;
var x = 0;
var y = 0;
var current = 1;
var direction = "R";
var values = {"00": 1};
var index = 0;
var possible;

function addIfPossible(x,y) {
    possible = String(x)+String(y);
    if (values[possible]){
        return values[possible];
    }
    return 0;
}

while (current < input) {
    switch(direction) {
        case "R":
            for(var i = 0; i < width && current < input; i++) {
                index++;
                x++;
                current = addIfPossible(x-1, y);
                current += addIfPossible(x, y+1);
                current += addIfPossible(x-1, y+1);
                current += addIfPossible(x+1, y+1);
                values[String(x)+String(y)] = current;
            }
            width += 2;
            direction = "U";
            break;
        case "U":
            for(var i = 0; i < height && current < input; i++) {
                index++;
                y++;
                current = addIfPossible(x, y-1);
                current += addIfPossible(x-1, y+1);
                current += addIfPossible(x-1, y);
                current += addIfPossible(x-1, y-1);
                values[String(x)+String(y)] = current;
            }
            height += 2;
            direction = "L";
            break;
        case "L":
            for(var i = 0; i < width-1 && current < input; i++) {
                index++;
                x--;
                current = addIfPossible(x+1, y);
                current += addIfPossible(x-1, y-1);
                current += addIfPossible(x, y-1);
                current += addIfPossible(x+1, y-1);
                values[String(x)+String(y)] = current;
            }
            direction = "D";
            break;
        case "D":
            for(var i = 0; i < height-1 && current < input; i++) {
                index++;
                y--;
                current = addIfPossible(x, y+1);
                current += addIfPossible(x+1, y-1);
                current += addIfPossible(x+1, y);
                current += addIfPossible(x+1, y+1);
                values[String(x)+String(y)] = current;
            }
            direction = "R";
            break;
    }
}

console.log(current);