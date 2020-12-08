from program import Program

with open("input.txt") as file:
    lines = file.read().split("\n")[:-1]

initial_program = Program(lines)
initial_program.run()
print(f"Initial program accumulator: {initial_program.accumulator}")

for i in range(len(lines)):
    program = Program(lines)
    program.flip_instruction(i)
    program.run()
    if program.finished():
        print(f"Fixed program accumulator: {program.accumulator}")
        break
