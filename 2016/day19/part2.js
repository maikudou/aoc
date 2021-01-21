const input = 3001330

const first = {
  id: 1,
  presents: 1
}
let current = first
for (var i = 2; i <= input; i++) {
  current.next = {
    id: i,
    presents: 1,
    prev: current
  }
  current = current.next
}
current.next = first
first.prev = current
current = first

let size = input

let victim = current
for (var i = 0; i < Math.floor(size / 2); i++) {
  victim = victim.next
}

let two = input % 2 != 0

while (current.presents < input) {
  current.presents += victim.presents

  victim.prev.next = victim.next
  victim.next.prev = victim.prev

  current = current.next
  size--

  victim = victim.next
  if (two) {
    victim = victim.next
  }
  two = !two
}

console.log(current.id)
