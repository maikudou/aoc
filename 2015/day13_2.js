var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day13.input')
});

var regexp = /(\w+) would (lose|gain) (\d+) happiness units by sitting next to (\w+)\./
var relations = {};
var variations = [];
var maxSum = 0;
var includeRegexp = /^[^9]+$/;
var excludeRegexp =/(.).*(\1)/;

lineReader.on('line', function (line) {
    var found = regexp.exec(line);
    if(relations[found[1]] == undefined){
        relations[found[1]] = {};
    }
    var points = parseInt(found[3], 10);
    if(found[2] == 'lose'){
        points = -points;
    }
    relations[found[1]][found[4]] = points
});

lineReader.on('close', function () {
    var names = Object.keys(relations);
    relations['Michael']={}
    for(name in relations){
        if(name != 'Michael'){
            relations[name]['Michael']=0;
            relations['Michael'][name]=0;
        }
    }
    var names = Object.keys(relations);
    for(var i=12345678; i<876543211; i++){
        var string = String(i);
        if(string.length < 9){
            string = '0'+string;
        }
        if(includeRegexp.test(string) && !excludeRegexp.test(string)){
            variations.push(i);

            var variationSum = 0;

            for(var j=0; j<string.length; j++){
                var left = j-1;
                var right = j+1;
                if(j == 0){
                    left = 8;
                }
                if(j==8){
                    right = 0;
                }

                variationSum += relations[names[string[j]]][names[string[right]]]
                variationSum += relations[names[string[j]]][names[string[left]]]
            }
            if(variationSum > maxSum){
                maxSum = variationSum;
            }
        }
    }

    console.log(maxSum);
});