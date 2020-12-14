import re
from itertools import chain, combinations


def apply_mask(value, mask):
    ones = int(mask.replace("X", "0"), 2)
    zeros = int(mask.replace("X", "1"), 2)
    return (value | ones) & zeros


def get_memory_addresses(value, decoder):
    binary_value_list = list(format(value, "36b").replace(" ", "0"))
    for i in range(36):
        if decoder[i] == "1":
            binary_value_list[i] = "1"
        elif decoder[i] == "X":
            binary_value_list[i] = "X"

    x_indexes = [i for i in range(36) if binary_value_list[i] == "X"]
    x_index_combinations = [combinations(x_indexes, r) for r in range(len(x_indexes) + 1)]
    flat_x_index_combinations = []

    for x_index_combination in x_index_combinations:
        for single_combination in x_index_combination:
            flat_x_index_combinations.append(single_combination)

    memory_addresses = []
    for x_index_combination in flat_x_index_combinations:
        for x_index in x_indexes:
            if x_index in x_index_combination:
                binary_value_list[x_index] = "0"
            else:
                binary_value_list[x_index] = "1"
        memory_addresses.append(int("".join(binary_value_list), 2))
    return memory_addresses


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
mask = None

for instruction in instructions:
    type = instruction[0]

    if type == "mask":
        mask = instruction[1]
    elif type == "memory":
        location = instruction[1]
        value = instruction[2]
        masked_value = apply_mask(value, mask)
        memory[location] = masked_value

print(f"Part 1: {sum(memory.values())}")

memory = {}
decoder = None

for instruction in instructions:
    type = instruction[0]

    if type == "mask":
        decoder = instruction[1]
    elif type == "memory":
        location = instruction[1]
        value = instruction[2]
        addresses = get_memory_addresses(location, decoder)
        for address in addresses:
            memory[address] = value

print(f"Part 2: {sum(memory.values())}")
