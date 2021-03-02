var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

class Tower {
  constructor(name, weight, children = []) {
    this.name = name
    this.weight = weight
    this.children = children
  }
  attachChildrens(towersHash) {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i] = towersHash[this.children[i]]
      this.children[i].parent = this
    }
  }
}

var towersHash = {}
var input
var tower
var topTower

lineReader.on('line', function (line) {
  input = /^(\w+).+\((\d+)\)(?: \-> (.+))?$/.exec(line)
  if (input[3]) {
    input[3] = input[3].split(', ')
  }
  tower = new Tower(input[1], Number(input[2]), input[3])
  towersHash[input[1]] = tower
})

lineReader.on('close', function () {
  var towerNames = Object.keys(towersHash)
  for (var i = 0; i < towerNames.length; i++) {
    tower = towersHash[towerNames[i]]
    tower.attachChildrens(towersHash)
  }
  topTower = towersHash[towerNames[0]]
  while (topTower.parent) {
    topTower = topTower.parent
  }
  console.log(topTower.name)
})
