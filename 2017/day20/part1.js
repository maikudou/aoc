var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const { Heap } = require('../../utils/Heap')

class PHeap extends Heap {
  _compare(a, b) {
    return a.d < b.d
  }
}

const heap = new PHeap()
const particles = []
let index = 0

lineReader.on('line', function (line) {
  const [
    _,
    x,
    y,
    z,
    vx,
    vy,
    vz,
    ax,
    ay,
    az
  ] = /p=<(-?\d+),(-?\d+),(-?\d+)>, v=<(-?\d+),(-?\d+),(-?\d+)>, a=<(-?\d+),(-?\d+),(-?\d+)>/.exec(
    line
  )
  const particle = {
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    z: parseInt(z, 10),
    vx: parseInt(vx, 10),
    vy: parseInt(vy, 10),
    vz: parseInt(vz, 10),
    ax: parseInt(ax, 10),
    ay: parseInt(ay, 10),
    az: parseInt(az, 10),
    d: Math.abs(x) + Math.abs(y) + Math.abs(z),
    id: index++
  }
  heap.insert(particle)
  particles.push(particle)
})

lineReader.on('close', function () {
  let closestNotChanged = 0
  let closest = heap.getTop()

  while (closestNotChanged < 500) {
    const heap = new PHeap()
    particles.forEach(particle => {
      particle.vx += particle.ax
      particle.vy += particle.ay
      particle.vz += particle.az
      particle.x += particle.vx
      particle.y += particle.vy
      particle.z += particle.vz
      particle.d = Math.abs(particle.x) + Math.abs(particle.y) + Math.abs(particle.z)
      heap.insert(particle)
    })
    closestNotChanged = heap.getTop() === closest ? closestNotChanged + 1 : 0
    closest = heap.getTop()
  }

  console.log(closest.id)
})
