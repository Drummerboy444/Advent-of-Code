from functools import reduce

with open("input.txt") as file:
    lines = file.read().split("\n")[:-1]

WIDTH = len(lines[0])


def count_trees_hit(instruction):
    trees = 0
    col = 0

    right = instruction[0]
    down = instruction[1]

    for row in range(0, len(lines), down):
        if lines[row][col] == "#":
            trees += 1

        col = (col + right) % WIDTH

    return trees


def multiply_answers(instructions):
    return reduce(lambda a, b: a * b, (count_trees_hit(instruction) for instruction in instructions))


print(multiply_answers([
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
]))
