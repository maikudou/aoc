var input = 33100000;
var presentsNumber = 0;

var maxNumber = 1000000;
var minNumber = 0;

while (presentsNumber < input) {

    var halfNumber = parseInt(minNumber + (maxNumber - minNumber) / 2, 10);
    presentsNumber = 0;

    for (var elfNumber = 1; elfNumber < halfNumber; elfNumber++) {
        if (halfNumber % elfNumber === 0) {
            presentsNumber += halfNumber / elfNumber * 10;
        }
    }

    if (presentsNumber < input) {
        minNumber = halfNumber;
    } else {
        maxNumber = halfNumber;
        minNumber = 0;
    }

    console.log(halfNumber, presentsNumber, minNumber, maxNumber);

    if (maxNumber - minNumber <= 1) {
        break;
    }
}

// console.log(houseNumber);
