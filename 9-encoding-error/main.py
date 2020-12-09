with open("input.txt") as file:
    lines = [int(line) for line in file.readlines()]


def contains_pair_that_sum(numbers, target):
    for i in range(len(numbers) - 1):
        for j in range(i, len(numbers)):
            if numbers[i] + numbers[j] == target:
                return True
    return False


def get_first_invalid_number(numbers):
    for i in range(25, len(numbers)):
        if not contains_pair_that_sum(numbers[i-25:i], numbers[i]):
            return numbers[i]


print(f"First invalid number is {get_first_invalid_number(lines)}")


def get_list_that_sums_to(numbers, target):
    for i in range(len(numbers)):
        potential_list = numbers[i:i+2]
        to_append = i + 2
        while sum(potential_list) < target:
            potential_list.append(numbers[to_append])
            to_append += 1
        if sum(potential_list) == target:
            return potential_list


list_that_sums_to = get_list_that_sums_to(lines, get_first_invalid_number(lines))
list_that_sums_to.sort()
print(f"Encryption weakness is {list_that_sums_to[0] + list_that_sums_to[-1]}")
