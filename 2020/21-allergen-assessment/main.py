import re
from typing import NamedTuple

with open("input.txt") as file:
    lines = file.read().split("\n")[:-1]


class Food(NamedTuple):
    ingredients: list[str]
    allergens: list[str]


foods = []
line_pattern = re.compile("(.+) \\(contains (.*)\\)")
for line in lines:
    line_match = line_pattern.match(line)
    ingredients = line_match[1].split()
    allergens = line_match[2].split(", ")
    foods.append(Food(ingredients, allergens))

allergens_to_ingredients = {}
for food in foods:
    for allergen in food.allergens:
        if allergen not in allergens_to_ingredients:
            allergens_to_ingredients[allergen] = set(food.ingredients)
        else:
            allergens_to_ingredients[allergen] = allergens_to_ingredients[allergen].intersection(set(food.ingredients))

potential_allergen_ingredients = set()
for allergen in allergens_to_ingredients:
    potential_allergen_ingredients = potential_allergen_ingredients.union(allergens_to_ingredients[allergen])

total = 0
for food in foods:
    for ingredient in food.ingredients:
        if ingredient not in potential_allergen_ingredients:
            total += 1
print(f"Part 1: {total}")


ingredient_to_allergen = {}


def can_reduce(dictionary):
    return any(len(value) == 1 for value in dictionary.values())


def reduce(dictionary):
    to_remove = None
    for key in dictionary:
        value = dictionary[key]
        if len(value) == 1:
            for e in value:
                to_remove = [key, e]
                ingredient_to_allergen[e] = key

    del dictionary[to_remove[0]]
    for key in dictionary:
        value = dictionary[key]
        if to_remove[1] in value:
            value.remove(to_remove[1])


while can_reduce(allergens_to_ingredients):
    reduce(allergens_to_ingredients)

# Just sorted and joined this to get the answer manually
print(ingredient_to_allergen)
