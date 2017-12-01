var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day19.input')
});

var results = [];
var replacements = {};
var molecule = 'CRnCaCaCaSiRnBPTiMgArSiRnSiRnMgArSiRnCaFArTiTiBSiThFYCaFArCaCaSiThCaPBSiThSiThCaCaPTiRnPBSiThRnFArArCaCaSiThCaSiThSiRnMgArCaPTiBPRnFArSiThCaSiRnFArBCaSiRnCaPRnFArPMgYCaFArCaPTiTiTiBPBSiThCaPTiBPBSiRnFArBPBSiRnCaFArBPRnSiRnFArRnSiRnBFArCaFArCaCaCaSiThSiThCaCaPBPTiTiRnFArCaPTiBSiAlArPBCaCaCaCaCaSiRnMgArCaSiThFArThCaSiThCaSiRnCaFYCaSiRnFYFArFArCaSiRnFYFArCaSiRnBPMgArSiThPRnFArCaSiRnFArTiRnSiRnFYFArCaSiRnBFArCaSiRnTiMgArSiThCaSiThCaFArPRnFArSiRnFArTiTiTiTiBCaCaSiRnCaCaFYFArSiThCaPTiBPTiBCaSiThSiRnMgArCaF'
var minimum = false;
var steps = 1;

lineReader.on('line', function (line) {
    var split = line.split(' => ');
    replacements[split[1]] = split[0];
});

lineReader.on('close', function () {
    getVariations(molecule, 1);
    console.log(minimum);
});

function getVariations(input, steps){
    var variations = []

    if(input == 'HF' || input == 'NAl' || input == 'OMg'){
        if(!minimum){
            minimum = steps;
        }
        if(steps<minimum){
            minimum = steps;
        }
    }

    for(replacementSearch in replacements){
        if(replacements[replacementSearch]=='e'){
            continue;
        }
        var startIndex = 0;
        while((nextIndex = input.indexOf(replacementSearch, startIndex)) > -1){
            startIndex = nextIndex+1;
            var variant = input.substr(0,nextIndex)+replacements[replacementSearch]+input.substr(nextIndex+replacementSearch.length);
            if(variations.indexOf(variant)==-1){
                variations.push(variant);
            }
        }
    }
    for(i in variations){
        getVariations(variations[i], steps+1);
    }
    return variations;
}