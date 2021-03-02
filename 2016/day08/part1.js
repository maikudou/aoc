var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const screen = []
for (var i = 0; i < 6; i++) {
  screen[i] = []
  for (var j = 0; j < 50; j++) {
    screen[i].push(' ')
  }
}

lineReader.on('line', function (line) {
  const [
    ,
    command,
    what,
    at,
    by,
    w,
    h
  ] = /^(rect|rotate) (?:(row|column) (?:x|y)=(\d+) by (\d+))?(?:(\d+)x(\d+))?$/.exec(line)

  if (command === 'rect') {
    for (var k = 0; k < h; k++) {
      for (var m = 0; m < w; m++) {
        screen[k][m] = 'x'
      }
    }
  } else if (what === 'row') {
    for (var l = 0; l < by; l++) {
      screen[at].unshift(screen[at].pop())
    }
  } else {
    const column = []
    for (var i = 0; i < 6; i++) {
      column.push(screen[i][at])
    }
    for (var j = 0; j < by; j++) {
      column.unshift(column.pop())
    }
    for (var v = 0; v < 6; v++) {
      screen[v][at] = column[v]
    }
  }
})

lineReader.on('close', function () {
  console.log(
    screen.reduce(function (acc, row) {
      return (
        acc +
        row.reduce(function (acc2, value) {
          return acc2 + (value === 'x' ? 1 : 0)
        }, 0)
      )
    }, 0)
  )
})
