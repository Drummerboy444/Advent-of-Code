with open("input.txt") as file:
    adapters = [int(line) for line in file.readlines()]

adapters.append(0)
adapters.sort()
adapters.append(adapters[-1] + 3)

ones = 0
twos = 0
threes = 0

for i in range(1, len(adapters)):
    diff = adapters[i] - adapters[i - 1]
    if diff == 1:
        ones += 1
    elif diff == 2:
        twos += 1
    elif diff == 3:
        threes += 1
    else:
        print(f"unknown diff {diff}")
    last_line = adapters[i]

print(f"Part 1: {ones * threes}")

adapter_graph = {}

for adapter in adapters:
    valid_next_adapters = []
    if adapter + 1 in adapters:
        valid_next_adapters.append(adapter + 1)
    if adapter + 2 in adapters:
        valid_next_adapters.append(adapter + 2)
    if adapter + 3 in adapters:
        valid_next_adapters.append(adapter + 3)
    adapter_graph[adapter] = valid_next_adapters

cache = {}


def count_valid_paths(adapter):
    if adapter == adapters[-1]:
        return 1

    valid_paths = 0

    for next_adapter in adapter_graph[adapter]:
        if next_adapter in cache:
            valid_paths += cache[next_adapter]
        else:
            valid_paths += count_valid_paths(next_adapter)

    cache[adapter] = valid_paths
    return valid_paths


print(f"Part 2: {count_valid_paths(0)}")
