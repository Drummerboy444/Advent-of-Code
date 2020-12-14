import re


def apply_mask(value, mask):
    ones = int(mask.replace("X", "0"), 2)
    zeros = int(mask.replace("X", "1"), 2)
    return (value | ones) & zeros


with open("input.txt") as file:
    lines = file.read().split("\n")[:-1]

mask_pattern = re.compile("mask = ([01X]{36})")
memory_pattern = re.compile(r"mem\[(\d+)\] = (\d+)")

instructions = []
for line in lines:
    mask_match = mask_pattern.match(line)
    if mask_match:
        mask = mask_match.group(1)
        instructions.append(["mask", mask])
        continue

    memory_match = memory_pattern.match(line)
    if memory_match:
        location = int(memory_match.group(1))
        value = int(memory_match.group(2))
        instructions.append(["memory", location, value])

memory = {}
mask = "X"*36

for instruction in instructions:
    type = instruction[0]

    if type == "mask":
        mask = instruction[1]
    elif type == "memory":
        location = instruction[1]
        value = instruction[2]
        masked_value = apply_mask(value, mask)
        memory[location] = masked_value

print(sum(memory.values()))
