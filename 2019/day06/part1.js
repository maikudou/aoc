var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const tree = new Map()
var total = 0

function dfs(root, count = 0) {
  total += count
  root.before = count
  root.after = count
  for (var i = 0; i < root.orbiters.length; i++) {
    dfs(tree.get(root.orbiters[i]), count + 1)
  }
  for (i = 0; i < root.orbiters.length; i++) {
    root.after = Math.max(root.after, tree.get(root.orbiters[i]).after + 1)
  }
}

lineReader.on('line', function (line) {
  const re = /^(.{1,3})\)(.{1,3})/gi
  var [, center, orbiter] = re.exec(line)
  if (!tree.has(center)) {
    tree.set(center, {
      orbiters: []
    })
  }
  if (!tree.has(orbiter)) {
    tree.set(orbiter, {
      orbiters: []
    })
  }
  tree.get(center).orbiters.push(orbiter)
})

lineReader.on('close', function () {
  dfs(tree.get('COM'))
  // console.log(tree);
  console.log(total)
})
