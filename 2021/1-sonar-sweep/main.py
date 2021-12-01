with open("input.txt") as file:
    depths = [int(depth) for depth in file.read().split("\n")]

# Part 1
increases = 0

for i in range(1, len(depths)):
    if depths[i] - depths[i - 1] > 0:
        increases += 1

print(f"Part 1: {increases}")

# Part 2
increases = 0

for i in range(3, len(depths)):
    window_1 = depths[i - 3] + depths[i - 2] + depths[i - 1]
    window_2 = depths[i - 2] + depths[i - 1] + depths[i - 0]
    if window_2 - window_1 > 0:
        increases += 1

print(f"Part 2: {increases}")
