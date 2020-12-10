with open("input.txt") as file:
    lines = [int(line) for line in file.readlines()]

lines.append(0)
lines.sort()
lines.append(lines[-1] + 3)

ones = 0
threes = 0

for i in range(1, len(lines)):
    diff = lines[i] - lines[i - 1]
    if diff == 1:
        ones += 1
    elif diff == 3:
        threes += 1
    else:
        print(f"unknown diff {diff}")
    last_line = lines[i]

print(ones * threes)
