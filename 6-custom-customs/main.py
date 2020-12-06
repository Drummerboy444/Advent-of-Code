from functools import reduce

with open("input.txt") as file:
    lines = [line[:-1] for line in file.readlines()]


groups = [[]]
for line in lines:
    if line:
        groups[-1].append(set(line))
    else:
        groups.append([])


total = sum(len(reduce(lambda a, b: a & b, group)) for group in groups)

print(total)

# One-liner
# with open("input.txt") as file:
#     print(sum((len(reduce(lambda a, b: set(a) & set(b), group.split())) for group in file.read().split("\n\n"))))
