with open("input.txt") as file:
    lines = file.read().strip().split()

instructions = []
for line in lines:
    instruction = []
    while line:
        if line[0] == "e":
            instruction.append("e")
            line = line[1:]
        elif line[0] == "w":
            instruction.append("w")
            line = line[1:]
        elif line[0] == "n" and line[1] == "e":
            instruction.append("ne")
            line = line[2:]
        elif line[0] == "n" and line[1] == "w":
            instruction.append("nw")
            line = line[2:]
        elif line[0] == "s" and line[1] == "e":
            instruction.append("se")
            line = line[2:]
        elif line[0] == "s" and line[1] == "w":
            instruction.append("sw")
            line = line[2:]
    instructions.append(instruction)

tiles_to_flip = []
for instruction in instructions:
    tile = [0, 0]
    for direction in instruction:
        if direction == "e":
            tile[0] += 1
        elif direction == "w":
            tile[0] -= 1
        elif direction == "ne":
            tile[0] += 1
            tile[1] += 1
        elif direction == "nw":
            tile[1] += 1
        elif direction == "se":
            tile[1] -= 1
        elif direction == "sw":
            tile[0] -= 1
            tile[1] -= 1
    if tile in tiles_to_flip:
        tiles_to_flip.remove(tile)
    else:
        tiles_to_flip.append(tile)

print(f"Part 1: {len(tiles_to_flip)}")


def get_adjacent_tiles(tile):
    return [
        [tile[0] + 1, tile[1]],
        [tile[0] - 1, tile[1]],
        [tile[0] + 1, tile[1] + 1],
        [tile[0], tile[1] + 1],
        [tile[0], tile[1] - 1],
        [tile[0] - 1, tile[1] - 1]
    ]


def count_adjacent_black_tiles(tile, black_tiles):
    adjacent_tiles = get_adjacent_tiles(tile)
    count = 0
    for adjacent_tile in adjacent_tiles:
        if adjacent_tile in black_tiles:
            count += 1
    return count


black_tiles = tiles_to_flip

for _ in range(100):
    next_generation = []
    for tile in black_tiles:
        adjacent_black_tiles = count_adjacent_black_tiles(tile, black_tiles)
        if adjacent_black_tiles == 1 or adjacent_black_tiles == 2:
            next_generation.append(tile)
        adjacent_tiles = get_adjacent_tiles(tile)
        for adjacent_tile in adjacent_tiles:
            if adjacent_tile not in black_tiles:
                adjacent_black_tiles = count_adjacent_black_tiles(adjacent_tile, black_tiles)
                if adjacent_black_tiles == 2 and adjacent_tile not in next_generation:
                    next_generation.append(adjacent_tile)
    black_tiles = next_generation

print(f"Part 2: {len(black_tiles)}")
