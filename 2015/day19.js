var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day19.input')
});

var results = [];
var replacements = {};
var molecule = 'CRnCaCaCaSiRnBPTiMgArSiRnSiRnMgArSiRnCaFArTiTiBSiThFYCaFArCaCaSiThCaPBSiThSiThCaCaPTiRnPBSiThRnFArArCaCaSiThCaSiThSiRnMgArCaPTiBPRnFArSiThCaSiRnFArBCaSiRnCaPRnFArPMgYCaFArCaPTiTiTiBPBSiThCaPTiBPBSiRnFArBPBSiRnCaFArBPRnSiRnFArRnSiRnBFArCaFArCaCaCaSiThSiThCaCaPBPTiTiRnFArCaPTiBSiAlArPBCaCaCaCaCaSiRnMgArCaSiThFArThCaSiThCaSiRnCaFYCaSiRnFYFArFArCaSiRnFYFArCaSiRnBPMgArSiThPRnFArCaSiRnFArTiRnSiRnFYFArCaSiRnBFArCaSiRnTiMgArSiThCaSiThCaFArPRnFArSiRnFArTiTiTiTiBCaCaSiRnCaCaFYFArSiThCaPTiBPTiBCaSiThSiRnMgArCaF'

lineReader.on('line', function (line) {
    var split = line.split(' => ');
    if(replacements[split[0]]){
        replacements[split[0]].push(split[1]);
    }else{
        replacements[split[0]] = [split[1]];
    }
});

var startIndex = 0;
var nextIndex = 0;
var result = null;

lineReader.on('close', function () {
    for(replacementSearch in replacements){
        for(var i=0; i<replacements[replacementSearch].length; i++){
            startIndex = 0;
            replacement = replacements[replacementSearch][i];
            while((nextIndex = molecule.indexOf(replacementSearch, startIndex)) > -1){
                startIndex = nextIndex+1;
                result = molecule.substr(0,nextIndex)+replacement+molecule.substr(nextIndex+replacementSearch.length);
                if(results.indexOf(result)==-1){
                    results.push(result);
                }
            }
        }
    }
    console.log(results.length);
});