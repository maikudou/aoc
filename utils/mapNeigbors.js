function north(map, width, index) {
  if (index >= width) {
    return map[index - width]
  }
  return null
}

function south(map, width, index) {
  if (index < map.length - width) {
    return map[index + width]
  }
  return null
}

function west(map, width, index) {
  if (index % width) {
    return map[index - 1]
  }
  return null
}

function east(map, width, index) {
  if ((index + 1) % width) {
    return map[index + 1]
  }
  return null
}

module.exports = {
  north,
  south,
  east,
  west
}
