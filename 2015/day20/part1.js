var input = 33100000
var primes = [false, false] // one is not prime
var primesArray = []
var presentsSum = 0
var houseNumber = 0
var deviders = {}

function isPrime(num) {
  if (typeof primes[num] !== 'undefined') {
    return primes[num]
  }
  for (var i = primes.length; i <= num; i++) {
    var prime = true

    for (var j = 0; j < primesArray.length; j++) {
      if (i % primesArray[j] === 0) {
        prime = false
        break
      }
    }
    if (prime) {
      primesArray.push(i)
      primes[i] = true
    } else {
      primes[i] = false
    }
  }
  return primes[num]
}

function getDeviders(num) {
  if (isPrime(num)) {
    return []
  }
  if (deviders[num]) {
    return deviders[num]
  }
  var primeDeviders = []
  var max = Math.sqrt(num)
  for (var i = 0; i < primesArray.length - 1; i++) {
    if (primesArray[i] > max) {
      break
    }
    if (num % primesArray[i] === 0) {
      primeDeviders.push(primesArray[i])
    }
  }
  var length = primeDeviders.length
  var localDeviders = primeDeviders.slice()
  for (var i = 0; i < length; i++) {
    var newDevider = num / primeDeviders[i]
    if (isPrime(newDevider)) {
      localDeviders.push(newDevider)
    } else {
      localDeviders.push(newDevider)
      localDeviders = localDeviders.concat(localDeviders, getDeviders(newDevider))
    }
    var flattenedDeviders = []
    for (var j = 0; j < localDeviders.length; j++) {
      if (flattenedDeviders.indexOf(localDeviders[j]) === -1) {
        flattenedDeviders.push(localDeviders[j])
      }
    }
    localDeviders = flattenedDeviders.slice()
  }
  deviders[num] = localDeviders
  return localDeviders
}

houseNumber = 0
presentsSum = 0
var date = new Date()
while (presentsSum < input) {
  houseNumber++
  presentsSum = 0
  presentsSum += houseNumber * 10 + 10
  if (!isPrime(houseNumber)) {
    var deviders = getDeviders(houseNumber)
    for (var i = 0; i < deviders.length; i++) {
      presentsSum += deviders[i] * 10
    }
  }
}

console.log(houseNumber)
