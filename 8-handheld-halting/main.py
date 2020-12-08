from program import Program

with open("input.txt") as file:
    lines = file.read().split("\n")[:-1]

for i in range(len(lines)):
    program = Program(lines)
    program.flip_instruction(i)
    program.run()
    if program.finished():
        print(f"Successful program by flipping instruction {i}")
        print(f"Accumulator {program.accumulator}")
        break
