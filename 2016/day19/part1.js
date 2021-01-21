const input = 3001330

const first = {
  id: 1,
  presents: 1
}
let current = first
for (var i = 2; i <= input; i++) {
  current.next = {
    id: i,
    presents: 1
  }
  current = current.next
}
current.next = first
current = first

while (current.presents < input) {
  current.presents += current.next.presents
  current.next = current.next.next
  current = current.next
}

console.log(current.id)
