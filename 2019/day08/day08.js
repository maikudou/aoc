var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
})

var input;
const columns = 25;
const rows = 6;
const layers = []
var minimal = Infinity;
var minimalLayer;

lineReader.on('line', function(line) {
    input = line.split("").map((num) => parseInt(num, 10));
})

lineReader.on('close', function() {
    for(var i = 0; i < input.length; i++) {
        const pixel = input[i];
        const layer = Math.floor(i / (columns * rows));
        if (!layers[layer]) {
            layers[layer] = []
        }
        // console.log(layer, i);
        layers[layer][pixel] = layers[layer][pixel] ? layers[layer][pixel] + 1 : 1
    }

    for (i = 0; i < layers.length; i++) {
        if (layers[i][0] < minimal) {
            minimal = layers[i][0];
            minimalLayer = i;
        }
    }
    console.log(layers);
    console.log(layers[minimalLayer]);
    console.log(layers[minimalLayer][1] * layers[minimalLayer][2])
})
