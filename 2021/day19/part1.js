var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/test0')
})

let scanners = []

lineReader.on('line', function (line) {
  if (line) {
    if (/\-\-\- scanner (\d)+ \-\-\-/.test(line)) {
      scanners.push([])
    } else {
      const [_, x, y] = /(-?\d+),(-?\d+)/.exec(line)
      scanners[scanners.length - 1].push({ x, y })
    }
  }
})

lineReader.on('close', function () {
  scanners = scanners.map(scanner => scanner.sort((a, b) => (a.x == b.x ? a.y - b.y : a.x - b.x)))
  for (const scanner of scanners) {
    for (const otherScanner of scanners) {
      if (otherScanner !== scanner) {
        let overlappingCount = 1
        let pa = 0
        let pb = 1
        let oPa = 0
        let oPb = 1
        while (pb < scanner.length && oPb < scanner.length) {
          const possiblyOverlapping =
            scanner[pb].x - scanner[pa].x == otherScanner[oPb].x - otherScanner[pa].x &&
            scanner[pb].y - scanner[pa].y == otherScanner[oPb].y - otherScanner[pa].y
          if (possiblyOverlapping) {
            pa++
            oPa++
          } else {
            oPa++
          }
        }
      }
    }
  }
})
