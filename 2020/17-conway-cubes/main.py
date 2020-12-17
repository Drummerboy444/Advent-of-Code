from typing import NamedTuple

with open("input.txt") as file:
    lines = file.read().strip().split("\n")


class Cube(NamedTuple):
    x: int
    y: int
    z: int
    w: int


cubes = []
for i in range(len(lines)):
    for j in range(len(lines[i])):
        if lines[i][j] == "#":
            cubes.append(Cube(j, i, 0, 0))


def count_neighbours(cubes, x, y, z, w):
    count = 0
    for test_x in range(x - 1, x + 2):
        for test_y in range(y - 1, y + 2):
            for test_z in range(z - 1, z + 2):
                for test_w in range(w - 1, w + 2):
                    if test_x == x and test_y == y and test_z == z and test_w == w:
                        continue
                    if Cube(test_x, test_y, test_z, test_w) in cubes:
                        count += 1
    return count


def get_next_generation(cubes):
    min_x = min(cube.x for cube in cubes)
    max_x = max(cube.x for cube in cubes)
    min_y = min(cube.y for cube in cubes)
    max_y = max(cube.y for cube in cubes)
    min_z = min(cube.z for cube in cubes)
    max_z = max(cube.z for cube in cubes)
    min_w = min(cube.w for cube in cubes)
    max_w = max(cube.w for cube in cubes)

    next_generation = []

    for x in range(min_x - 1, max_x + 2):
        for y in range(min_y - 1, max_y + 2):
            for z in range(min_z - 1, max_z + 2):
                for w in range(min_w - 1, max_w + 2):
                    neighbour_count = count_neighbours(cubes, x, y, z, w)
                    if Cube(x, y, z, w) in cubes and 2 <= neighbour_count <= 3:
                        next_generation.append(Cube(x, y, z, w))
                    elif neighbour_count == 3:
                        next_generation.append(Cube(x, y, z, w))

    return next_generation


for i in range(6):
    print(f"Calculating generation {i}")
    cubes = get_next_generation(cubes)
print(f"Part 2: {len(cubes)}")
