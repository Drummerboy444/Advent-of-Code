with open("input.txt") as file:
    lines = [int(line) for line in file.readlines()]


def contains_pair_that_sum(numbers, target):
    for i in range(len(numbers) - 1):
        for j in range(i, len(numbers)):
            if numbers[i] + numbers[j] == target:
                return True
    return False


for i in range(25, len(lines)):
    if not contains_pair_that_sum(lines[i-25:i], lines[i]):
        print(lines[i])
