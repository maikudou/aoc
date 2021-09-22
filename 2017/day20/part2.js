var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

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
  particles.push(particle)
})

lineReader.on('close', function () {
  let iterations = 0
  let vParticles = particles.slice()

  while (iterations < 500) {
    const coords = new Map()
    const collisions = new Set()
    const newParticles = []
    vParticles.forEach(particle => {
      particle.vx += particle.ax
      particle.vy += particle.ay
      particle.vz += particle.az
      particle.x += particle.vx
      particle.y += particle.vy
      particle.z += particle.vz
      particle.d = Math.abs(particle.x) + Math.abs(particle.y) + Math.abs(particle.z)

      const { x, y, z } = particle

      if (!coords.has(`${x}|${y}|${z}`)) {
        coords.set(`${x}|${y}|${z}`, particle.id)
        newParticles.push(particle)
      } else {
        collisions.add(`${x}|${y}|${z}`)
      }
    })
    iterations++
    vParticles = newParticles.filter(
      particle => !collisions.has(`${particle.x}|${particle.y}|${particle.z}`)
    )
  }

  console.log(vParticles.length)
})
