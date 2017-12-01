var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day18.input')
});

var rows = [];

lineReader.on('line', function (line) {
    var columns = [];
    for(var i=0; i<line.length; i++){
        columns.push(line[i] == '#' ? true : false)
    }
    rows.push(columns);
});

lineReader.on('close', function () {
    for(var step =0; step<100; step++){
        var newState = [];
        for(var row=0; row<100; row++){
            var line = [];
            for(var column=0; column<100; column++){
                var cellState = rows[row][column];
                var onCount = 0;
                for(var i=-1; i<2; i++){
                    if(rows[row+i]){
                        if(i==0){
                            for(var j=-1; j<2; j+=2){
                                if(rows[row+i][column+j]){
                                   onCount++;
                                }
                            }
                        }else{
                            for(var j=-1; j<2; j++){
                                if(rows[row+i][column+j]){
                                   onCount++;
                                }
                            }
                        }
                    }
                }

                if(cellState){
                    if(onCount < 2 || onCount > 3){
                        cellState = false
                    }
                }else{
                    if(onCount == 3){
                        cellState = true;
                    }
                }
                line.push(cellState);
            }
            newState.push(line);
        }
        rows = newState;
    }
    var onCount = 0;
    for(var row=0; row<100; row++){
        for(var column=0; column<100; column++){
            if(rows[row][column]){
                onCount++;
            }
        }
    }
    console.log(onCount);
});