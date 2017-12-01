var input = 33100000;
var primes = [false, false];  //one is not prime
var primesArray = [];
var presentsSum = 0;
var houseNumber = 0;
var deviders = {};

function isPrime(num){
    if(typeof primes[num] != 'undefined'){
        return primes[num];
    }

    for(var i=primes.length; i<=num; i++){
        var prime = true;
        for(var j=0; j<primesArray.length; j++){
            if(i%primesArray[j]==0){
                prime = false;
                break;
            }
        }
        if(prime){
            primesArray.push(i);
            primes[i]=true;
        }else{
            primes[i]=false;
        }
    }
    return primes[num];
}

function getDeviders(num){
    if(isPrime(num)){
        return [1, num];
    }
    var deviders=[];
    var max = num/2;
    for(var i=2; i<=max; i++){
        if(num%i==0){
            deviders.push(i);
        }
    }
    return [1].concat(deviders, num);
}

var servedHouses = [0,0];

presentsSum = 0;
houseNumber = 0;

var date = new Date();
while(presentsSum < input){
    houseNumber++;
    presentsSum=0;

    var deviders = getDeviders(houseNumber);
    for(var i=0; i<deviders.length; i++){
        if(houseNumber/deviders[i] <= 50){
            presentsSum += deviders[i]*11;
        }
    }
}

console.log(houseNumber, presentsSum, new Date()-date);
