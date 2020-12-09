with open("input.txt") as file:
    lines = [int(line) for line in file.readlines()]


def contains_pair_that_sum(numbers, target):
    for i in range(len(numbers) - 1):
        for j in range(i + 1, len(numbers)):
            if numbers[i] + numbers[j] == target:
                return True
    return False


def get_first_invalid_number(numbers):
    for i in range(25, len(numbers)):
        if not contains_pair_that_sum(numbers[i - 25:i], numbers[i]):
            return numbers[i]


first_invalid_number = get_first_invalid_number(lines)
print(f"First invalid number: {first_invalid_number}")


def get_list_that_sums_to(numbers, target):
    for i in range(len(numbers)):
        potential_list = numbers[i:i + 2]
        while sum(potential_list) < target:
            potential_list.append(numbers[i + len(potential_list)])
        if sum(potential_list) == target:
            return potential_list


list_that_sums_to = get_list_that_sums_to(lines, first_invalid_number)
list_that_sums_to.sort()
print(f"Encryption weakness: {list_that_sums_to[0] + list_that_sums_to[-1]}")
