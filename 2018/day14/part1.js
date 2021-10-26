const input = 323081

const recipies = [3, 7]
let a = 0
let b = 1
while (recipies.length < input + 10) {
  const sum = recipies[a] + recipies[b]
  if (sum < 10) {
    recipies.push(sum)
  } else {
    recipies.push(Math.floor(sum / 10))
    recipies.push(sum % 10)
  }
  a = 1 + a + (recipies[a] % recipies.length)
  if (a >= recipies.length) {
    a = a - recipies.length
  }
  b = 1 + b + (recipies[b] % recipies.length)
  if (b >= recipies.length) {
    b = b - recipies.length
  }
}
console.log(recipies.slice(input).slice(0, 10).join(''))
