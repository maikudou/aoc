var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let start
let pointer

lineReader.on('line', function (line) {
  if (!start) {
    start = {
      n: null,
      p: null,
      v: parseInt(line, 10)
    }
    pointer = start
  } else {
    pointer.n = {
      n: null,
      p: pointer,
      v: parseInt(line, 10)
    }
    pointer = pointer.n
  }
})

function swap(a, b) {
  const aN = a.n
  const aP = a.p

  if (a.p === b) {
    a.p = b.p
    b.p.n = a
    b.p = a
    a.n = b
    b.n = aN
    aN.p = b
  } else if (a.n === b) {
    a.n = b.n
    b.n.p = a
    a.p = b
    b.n = a
    b.p = aP
    aP.n = b
  } else {
    a.n = b.n
    b.n.p = a
    a.p = b.p
    b.p.n = a

    b.n = aN
    aN.p = b
    b.p = aP
    aP.n = b
  }
}

function print(start) {
  console.log(start.v)
  let pointer = start.n

  while (pointer != start) {
    console.log(pointer.v)
    pointer = pointer.n
  }
  console.log('')
}

lineReader.on('close', function () {
  pointer.n = start
  start.p = pointer

  const order = [start]

  pointer = start.n

  while (pointer != start) {
    order.push(pointer)
    pointer = pointer.n
  }

  order.forEach(o => {
    for (let i = 0; i < Math.abs(o.v); i++) {
      swap(o, o.v > 0 ? o.n : o.p)
    }
  })

  pointer = start
  while (pointer.v != 0) {
    pointer = pointer.n
  }
  const zero = pointer
  let sum = 0
  for (let i = 0; i < 1000 % order.length; i++) {
    pointer = pointer.n
  }
  sum += pointer.v
  pointer = zero
  for (let i = 0; i < 2000 % order.length; i++) {
    pointer = pointer.n
  }
  sum += pointer.v
  pointer = zero
  for (let i = 0; i < 3000 % order.length; i++) {
    pointer = pointer.n
  }
  sum += pointer.v
  console.log(sum)
})
