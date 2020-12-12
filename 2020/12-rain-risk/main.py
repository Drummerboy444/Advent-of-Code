from typing import NamedTuple
import re


class Instruction(NamedTuple):
    type: str
    magnitude: int


class Position(NamedTuple):
    x: int
    y: int

    def __add__(self, other):
        return Position(self.x + other.x, self.y + other.y)

    def get_manhattan_distance(self):
        return abs(self.x) + abs(self.y)


instruction_pattern = re.compile("([NSEWLRF])([0-9]+)")


def to_instruction(raw_instruction):
    match = instruction_pattern.match(raw_instruction)
    return Instruction(match.group(1), int(match.group(2)))


with open("input.txt") as file:
    lines = file.read().split()

instructions = [to_instruction(raw_instruction) for raw_instruction in lines]
position = Position(0, 0)
facing = 0

direction_to_position_change = {
    "N": lambda m: Position(0, m),
    "S": lambda m: Position(0, -m),
    "E": lambda m: Position(m, 0),
    "W": lambda m: Position(-m, 0)
}

rotation_to_facing_change = {
    "R": lambda m: m,
    "L": lambda m: -m
}

facing_to_direction = {
    0: "E",
    90: "S",
    180: "W",
    270: "N"
}

for instruction in instructions:
    type = instruction.type
    magnitude = instruction.magnitude

    if type in direction_to_position_change:
        position += direction_to_position_change[type](magnitude)
    elif type in rotation_to_facing_change:
        facing += rotation_to_facing_change[type](magnitude)
        facing = facing % 360
    elif type == "F":
        position += direction_to_position_change[facing_to_direction[facing]](magnitude)


print(position)
print(position.get_manhattan_distance())
