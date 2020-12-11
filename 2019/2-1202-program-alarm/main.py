from intcode_computer import IntcodeComputer

with open("input.txt") as file:
    program = [int(number) for number in file.read().split(",")]

computer = IntcodeComputer()

program[1] = 12
program[2] = 2
computer.run(program)
print(f"Part 1: {computer.get_output()}")


def solve_noun_and_verb():
    for noun in range(0, 99):
        for verb in range(0, 99):
            program[1] = noun
            program[2] = verb
            computer.run(program)
            if computer.get_output() == 19690720:
                return 100 * noun + verb


print(f"Part 2: {solve_noun_and_verb()}")
