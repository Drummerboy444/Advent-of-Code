from math import prod

from tile import parse_raw_tile

with open("input.txt") as file:
    tiles = [parse_raw_tile(raw_tile) for raw_tile in file.read().split("\n\n")]


def get_match_count(tile):
    match_count = 0
    for other in tiles:
        if tile is other:
            continue
        if tile.matches(other):
            match_count += 1
    return match_count


corners = []
for i in range(len(tiles)):
    print(f"checking: {i}")
    tile = tiles[i]
    if (get_match_count(tile)) == 2:
        corners.append(tile)
print(prod(corner.tile_id for corner in corners))
