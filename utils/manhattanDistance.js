module.exports = function manhattanDistance(pointA, pointB) {
  return (
    Math.abs(pointB.x - pointA.x) +
    Math.abs(pointB.y - pointA.y) +
    (pointA.z !== undefined && pointB.z !== undefined ? Math.abs(pointB.z - pointA.z) : 0)
  )
}
