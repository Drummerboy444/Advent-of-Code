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

    def __mul__(self, other):
        return Position(self.x * other, self.y * other)

    def __rmul__(self, other):
        return Position(self.x * other, self.y * other)

    def __neg__(self):
        return Position(-self.x, -self.y)

    def get_manhattan_distance(self):
        return abs(self.x) + abs(self.y)


instruction_pattern = re.compile("([NSEWLRF])([0-9]+)")


def to_instruction(raw_instruction):
    match = instruction_pattern.match(raw_instruction)
    return Instruction(match.group(1), int(match.group(2)))


with open("input.txt") as file:
    lines = file.read().split()

instructions = [to_instruction(raw_instruction) for raw_instruction in lines]
ship = Position(0, 0)
waypoint = Position(10, 1)

direction_to_position_change = {
    "N": lambda m: Position(0, m),
    "S": lambda m: Position(0, -m),
    "E": lambda m: Position(m, 0),
    "W": lambda m: Position(-m, 0)
}

rotation_to_facing_change = {
    "R": lambda m: m % 360,
    "L": lambda m: -m % 360
}

for instruction in instructions:
    type = instruction.type
    magnitude = instruction.magnitude

    if type in direction_to_position_change:
        waypoint += direction_to_position_change[type](magnitude)
    elif type in rotation_to_facing_change:
        facing_change = rotation_to_facing_change[type](magnitude)
        if facing_change == 90:
            waypoint = Position(waypoint.y, -waypoint.x)
        elif facing_change == 180:
            waypoint = -waypoint
        elif facing_change == 270:
            waypoint = Position(-waypoint.y, waypoint.x)
    elif type == "F":
        ship += waypoint * magnitude

print(ship)
print(ship.get_manhattan_distance())
