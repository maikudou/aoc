const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let numbersDraw
const boards = []
let currentBoard

lineReader.on('line', function (line) {
  if (!line) {
    if (currentBoard) {
      boards.push(currentBoard)
    }
    currentBoard = []
    return
  }
  if (!numbersDraw) {
    numbersDraw = line.split(',').map(toDecimal)
  } else {
    currentBoard = currentBoard.concat(
      line
        .split(/\s+/)
        .filter(n => n !== '')
        .map(toDecimal)
        .map(num => ({ num, marked: false }))
    )
  }
})

function isWinning(board) {
  return board.slice(0, 21).reduce((acc, value, index) => {
    if (acc) {
      return acc
    }
    let winning = false
    if (index % 5 === 0) {
      winning = value.marked && [1, 2, 3, 4].every(ind => board[ind + index].marked)
    }
    if (index < 5) {
      winning =
        winning || (value.marked && [1, 2, 3, 4].every(ind => board[index + 5 * ind].marked))
    }
    return winning
  }, false)
}

lineReader.on('close', function () {
  let lastBoard
  let lastNumber

  let winningBoards = new Set()

  boards.push(currentBoard)
  numbersDraw.forEach(number => {
    boards.forEach(board => {
      const boardNum = board.find(num => num.num === number)
      boardNum && (boardNum.marked = true)
      const boardWins = isWinning(board)
      if (boardWins && !winningBoards.has(board)) {
        winningBoards.add(board)
        lastBoard = board.slice(0).map(cell => ({ ...cell }))
        lastNumber = number
      }
    })
  })
  console.log(
    lastNumber * lastBoard.reduce((acc, value) => acc + (value.marked ? 0 : value.num), 0)
  )
})
