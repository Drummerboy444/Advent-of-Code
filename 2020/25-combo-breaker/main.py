with open("input.txt") as file:
    public_keys = [int(line.strip()) for line in file.readlines()]


def transform(subject_number, loop_size, starting_value=1):
    value = starting_value
    for _ in range(loop_size):
        value *= subject_number
        value = value % 20201227
    return value


def get_loop_size(public_key):
    loop_size = 0
    transformed_value = 1
    while True:
        transformed_value = transform(7, 1, transformed_value)
        loop_size += 1
        if transformed_value == public_key:
            return loop_size


def get_encryption_key(public_key_1, public_key_2):
    loop_size_1 = get_loop_size(public_key_1)
    return transform(public_key_2, loop_size_1)


print(f"Part 1: {get_encryption_key(public_keys[0], public_keys[1])}")
