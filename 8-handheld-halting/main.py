from program import Program

with open("input.txt") as file:
    lines = file.read().split("\n")[:-1]

program = Program(lines)

while not program.in_loop():
    program.run_next_instruction()

print(program.accumulator)
