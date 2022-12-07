const toDecimal = require('../../utils/toDecimal')

const commandRegExp = /^\$ (\S+)(?: (\S+))?/
const dirRegExp = /^dir (\S+)/
const fileRegExp = /^(\d+) (\S+)/

const root = {
  name: '/',
  children: new Map(),
  parent: null,
  size: 0
}
let pointer = root

function parseLine(line) {
  if (commandRegExp.test(line)) {
    const [_, command, operand] = commandRegExp.exec(line)
    switch (command) {
      case 'cd':
        if (operand === '/') {
          pointer = root
        } else if (operand === '..') {
          pointer = pointer.parent
        } else {
          pointer = pointer.children.get(operand)
        }
        break
      case 'ls':
        break
    }
  } else if (dirRegExp.test(line)) {
    const [_, dirName] = dirRegExp.exec(line)
    if (!pointer.children.has(dirName)) {
      pointer.children.set(dirName, {
        name: dirName,
        children: new Map(),
        parent: pointer,
        size: 0
      })
    }
  } else if (fileRegExp.test(line)) {
    const [_, size, fileName] = fileRegExp.exec(line)
    if (!pointer.children.has(fileName)) {
      pointer.children.set(fileName, { name: fileName, parent: pointer, size: toDecimal(size) })
      let traverseUpPointer = pointer
      while (traverseUpPointer) {
        traverseUpPointer.size += toDecimal(size)
        traverseUpPointer = traverseUpPointer.parent
      }
    }
  }
}

module.exports = { parseLine, root }
