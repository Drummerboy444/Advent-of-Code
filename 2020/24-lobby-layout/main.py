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

print(len(tiles_to_flip))
