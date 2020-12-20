import re

tile_id_pattern = re.compile("Tile (\\d+):")


def parse_raw_tile(raw_tile):
    raw_tile_split = raw_tile.split("\n")

    tile_id_match = tile_id_pattern.match(raw_tile_split[0])
    tile_id = int(tile_id_match[1])

    raw_rows = raw_tile_split[1:]
    rows = [list(raw_row) for raw_row in raw_rows]

    return Tile(tile_id, rows)


class Tile:
    def __init__(self, tile_id, rows):
        self.tile_id = tile_id
        self.rows = rows

    def print(self):
        print(f"Tile {self.tile_id}:")
        for row in self.rows:
            for col in row:
                print(col, end="")
            print()

    def get_row(self, index):
        return self.rows[index]

    def get_col(self, index):
        return [row[index] for row in self.rows]

    def rotate(self):
        self.rows = self.get_rotated_rows()

    def get_rotated_rows(self):
        rotated_rows = [[None] * 10 for _ in self.rows]
        for i in range(10):
            for j in range(10):
                rotated_rows[j][9 - i] = self.rows[i][j]
        return rotated_rows

    def flip(self):
        self.rows = self.get_flipped_rows()

    def get_flipped_rows(self):
        flipped_rows = [[None] * 10 for _ in self.rows]
        for i in range(10):
            for j in range(10):
                flipped_rows[9 - i][j] = self.rows[i][j]
        return flipped_rows

    def matches(self, other):
        for _ in range(4):
            for __ in range(4):
                if self.top_rows_match(other):
                    return True
                other.rotate()
            self.rotate()
        return False

    def top_rows_match(self, other):
        matches = True
        for i in range(10):
            if self.get_row(0)[i] != other.get_row(0)[i]:
                matches = False
        if matches:
            return True

        matches = True
        for i in range(10):
            if self.get_row(0)[i] != other.get_row(0)[9 - i]:
                matches = False
        if matches:
            return True
        return False
