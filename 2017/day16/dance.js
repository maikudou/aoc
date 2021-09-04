module.exports = function dance(moves, starter) {
  moves.map(command => {
    let [_, operation, operand1, operand2] = /(s|x|p)(\d+|\w)\/?(\d+|\w)?/g.exec(command)
    let node1
    let node2
    let node2Letter

    switch (operation) {
      case 's':
        for (let i = 0; i < parseInt(operand1, 10); i++) {
          const last = starter.prev
          starter = last
        }
        break
      case 'x':
        node1 = starter
        node2 = starter
        while (operand1 > 0) {
          node1 = node1.next
          operand1--
        }
        while (operand2 > 0) {
          node2 = node2.next
          operand2--
        }
        node2Letter = node2.letter
        node2.letter = node1.letter
        node1.letter = node2Letter
        break
      case 'p':
        node1 = starter
        node2 = starter
        while (operand1 !== node1.letter) {
          node1 = node1.next
        }
        while (operand2 !== node2.letter) {
          node2 = node2.next
        }
        node2Letter = node2.letter
        node2.letter = node1.letter
        node1.letter = node2Letter
        break
    }
  })
  let position = ''
  current = starter
  while (current.next !== starter) {
    position = `${position}${current.letter}`
    current = current.next
  }
  position = `${position}${current.letter}`

  return {
    position,
    starter
  }
}
