from typing import NamedTuple

with open("input.txt") as file:
    lines = file.read().split("\n")


class Instruction(NamedTuple):
    direction: str
    magnitude: int


def get_instruction(line):
    parts = line.split()
    return Instruction(parts[0], int(parts[1]))


class Position(NamedTuple):
    depth: int
    position: int
    aim: int

    def __add__(self, other):
        return Position(
            self.depth + other.depth,
            self.position + other.position,
            self.aim + other.aim
        )


def get_final_position(instructions):
    position = Position(0, 0, 0)

    for instruction in instructions:
        if instruction.direction == "up":
            position += Position(0, 0, -instruction.magnitude)
        elif instruction.direction == "down":
            position += Position(0, 0, instruction.magnitude)
        elif instruction.direction == "forward":
            position += Position(
                position.aim * instruction.magnitude,
                instruction.magnitude,
                0
            )

    return position


final_position = get_final_position([get_instruction(line) for line in lines])
print(final_position.position * final_position.depth)
