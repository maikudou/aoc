const input = 323081

const recipies = [3, 7]
let a = 0
let b = 1
while (true) {
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
  const length = recipies.length
  if (
    // recipies[length - 6] == 3 &&
    (recipies[length - 6] == 3 &&
      recipies[length - 5] == 2 &&
      recipies[length - 4] == 3 &&
      recipies[length - 3] == 0 &&
      recipies[length - 2] == 8 &&
      recipies[length - 1] == 1) ||
    (recipies[length - 7] == 3 &&
      recipies[length - 6] == 2 &&
      recipies[length - 5] == 3 &&
      recipies[length - 4] == 0 &&
      recipies[length - 3] == 8 &&
      recipies[length - 2] == 1)
  ) {
    console.log(length - (recipies[length - 7] === 3 ? 7 : 6))
    process.exit()
  }
}
