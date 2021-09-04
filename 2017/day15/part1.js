const genAStart = 516
const genBStart = 190

const genAFactor = 16807
const genBFactor = 48271
const devisor = 2147483647
const interations = 40000000

// We'll use thi mask (it's 16 1s from the right) to
// bitwise & it woth the number, effectively getting only
// 16 lower bits of it, so it can be easily compared
const bit16 = 0xffff

let genACurrent = genAStart
let genBCurrent = genBStart

let count = 0

for (let i = 0; i < interations; i++) {
  genACurrent = (genACurrent * genAFactor) % devisor
  genBCurrent = (genBCurrent * genBFactor) % devisor

  count += (genACurrent & bit16) === (genBCurrent & bit16) ? 1 : 0
}

console.log(count)
