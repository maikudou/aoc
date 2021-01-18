var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const foods = []
let id = 0
const allergensToFoods = new Map()
const ingredients = new Map()
const ingredientAppearance = new Map()
let allergens = []

lineReader.on('line', function (line) {
  const [_, ingredients, allergens] = /^(.+) \(contains (.+)\)$/.exec(line)
  const food = {
    ingredients: ingredients.split(' '),
    allergens: allergens.split(', '),
    id: id++
  }
  foods.push(food)
  food.allergens.forEach(allergen => {
    allergensToFoods.set(
      allergen,
      (allergensToFoods.get(allergen) || []).concat({
        ...food,
        ingredients: new Set(food.ingredients)
      })
    )
  })
})

lineReader.on('close', function () {
  // console.log(foods)
  // console.log(allergensToFoods)
  allergens = Array.from(allergensToFoods.keys())
  foods.forEach(food => {
    food.ingredients.forEach(ingredient => {
      const existingIngredient = ingredients.get(ingredient) || {
        possibly: new Set(food.allergens),
        definitelyNot: new Set(),
        appearance: 0
      }
      existingIngredient.appearance++
      food.allergens.forEach(allergen => {
        if (existingIngredient.definitelyNot.has(allergen)) {
          return
        }
        existingIngredient.possibly.add(allergen)
        // Check if definitely exist in other foods
        // If not, it definitely does not have that allergen
        if (
          !allergensToFoods.get(allergen).every(otherFood => {
            if (otherFood.id !== food.id) {
              // console.log('other', otherFood.ingredients)
              if (otherFood.ingredients.has(ingredient)) {
                return true
              } else {
                return false
              }
            } else {
              return true
            }
          })
        ) {
          existingIngredient.definitelyNot.add(allergen)
        }
      })
      // But if it exist in some other food, it might have any allergen
      allergens.forEach(allergen => {
        if (!existingIngredient.possibly.has(allergen)) {
          if (
            !allergensToFoods.get(allergen).some(otherFood => {
              return otherFood.ingredients.has(ingredient)
            })
          ) {
            existingIngredient.definitelyNot.add(allergen)
          }
        }
      })
      ingredients.set(ingredient, existingIngredient)
    })
  })
  console.log(
    Array.from(ingredients.values()).reduce((acc, value) => {
      if (value.definitelyNot.size == allergens.length) {
        acc += value.appearance
      }
      return acc
    }, 0)
  )
})
